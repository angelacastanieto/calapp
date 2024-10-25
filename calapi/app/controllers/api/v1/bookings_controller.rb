class Api::V1::BookingsController < ApplicationController
  before_action :set_booking, only: %i[ show update destroy ]

  # GET /bookings
  def index
    coach_user_id = booking_params[:coach_user_id]
    user_id = booking_params[:user_id]
    from_time = booking_params[:from_time]
    to_time = booking_params[:to_time]

    return render json: {errors: ['user_id, from_time and to_time required']}, 
      status: :bad_request unless (user_id && from_time && to_time)

    time_slot_ids = TimeSlot.where(user_id: coach_user_id)
                            .where('? <= start_time', Time.parse(from_time))
                            .where('? >= end_time', Time.parse(to_time)).map(&:id)

    @bookings = Booking.includes(:time_slot)
                        .where(user_id: user_id)
                        .where(time_slot_id: time_slot_ids)
                        .order({ time_slots: { start_time: :asc }})
                   
    render json: @bookings.map { |booking| { booking: booking, time_slot: booking.time_slot }}
  end

  # GET /bookings/1
  def show
    render json: @booking
  end

  # POST /bookings
  def create
    # TODO: move logic to model
    user_id = booking_params[:user_id]
    time_slot_id = booking_params[:time_slot_id]

    @booking = Booking.new(user_id: user_id, time_slot_id: time_slot_id)

    if @booking.save
      render json: @booking, status: :created
    else
      render json: @booking.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /bookings/1
  def update
    if @booking.update(booking_params)
      render json: @booking
    else
      render json: @booking.errors, status: :unprocessable_entity
    end
  end

  # DELETE /bookings/1
  def destroy
    @booking.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_booking
      @booking = Booking.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def booking_params
      params.permit(:user_id, :coach_user_id, :time_slot_id, :from_time, :to_time)
    end
end
