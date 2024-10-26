require "pry"

class Api::V1::TimeSlotsController < ApplicationController
  before_action :set_time_slot, only: %i[ show update destroy ]

  # GET /time_slots
  def index
    requester_user_id = time_slot_params[:requester_user_id]
    creator_user_id = time_slot_params[:creator_user_id]
    from_time = time_slot_params[:from_time]
    to_time = time_slot_params[:to_time]
    include_creator = time_slot_params[:include_creator]
    include_bookings = time_slot_params[:include_bookings]

    return render json: { errors: [ "requester_user_id, creator_user_id, from_time and to_time required" ] },
      status: :bad_request unless requester_user_id && creator_user_id && from_time && to_time

    requester = User.find_by(id: requester_user_id)
    return render json: { errors: [ "user not found" ] }, status: :not_found unless requester

    time_slots = TimeSlot.where(user_id: creator_user_id)
    time_slots.includes(:booking) if include_bookings
    time_slots.includes(:user) if include_creator
    @time_slots = time_slots.where("? <= start_time", Time.parse(from_time))
                            .where("? >= end_time", Time.parse(to_time))
                            .order(start_time: :asc)

    time_slot_data = @time_slots.map do |time_slot|
      booking = time_slot.booking
      booker = booking&.user
      permitted_to_see_booking = requester.is_coach || booker&.id == requester.id

      {
        time_slot: time_slot,
        creator: time_slot.user,
        is_booked: !!time_slot.booking,
        booking: permitted_to_see_booking ? booking : nil,
        booker: permitted_to_see_booking ? booker : nil
      }
    end

    render json: time_slot_data
  end

  # GET /time_slots/1
  def show
    render json: @time_slot
  end

  # POST /time_slots
  def create
    start_time_string = time_slot_params[:start_time]
    user_id = time_slot_params[:user_id]
    start_time = Time.parse(start_time_string)
    end_time = start_time + 2.hours

    user = User.find_by(id: user_id)

    return render json: { errors: [ "user not found" ] }, status: :not_found unless user

    return render json: { errors: [ "cannot create time slots for this user" ] },
      status: :bad_request unless user.is_coach

    overlapping_time_slots = TimeSlot.where(user_id: user_id)
                                     .where("? >= start_time AND ? < end_time", start_time, start_time)
                                     .or(TimeSlot.where("? > start_time AND ? <= end_time", end_time, end_time))

    return render json: { errors: [ "Another time slot for this user exists during these start and end times" ] },
           status: :unprocessable_entity if overlapping_time_slots.length > 0

    @time_slot = TimeSlot.new(start_time: start_time_string, end_time: end_time.iso8601, user_id: user.id)

    if @time_slot.save
      render json: @time_slot, status: :created
    else
      render json: @time_slot.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /time_slots/1
  def update
    if @time_slot.update(time_slot_params)
      render json: @time_slot
    else
      render json: @time_slot.errors, status: :unprocessable_entity
    end
  end

  # DELETE /time_slots/1
  def destroy
    @time_slot.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_time_slot
      @time_slot = TimeSlot.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def time_slot_params
      params.permit(:user_id, :requester_user_id, :creator_user_id, :start_time, :from_time, :to_time)
    end
end
