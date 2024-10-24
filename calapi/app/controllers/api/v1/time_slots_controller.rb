class Api::V1::TimeSlotsController < ApplicationController
  before_action :set_time_slot, only: %i[ show update destroy ]

  # GET /time_slots
  def index
    user_id = time_slot_params[:user_id]
    from_time = time_slot_params[:from_time]
    to_time = time_slot_params[:to_time]

    # this could be changed to optionally include from_time and to_time in the time_slot query
    # if a user case is found
    @time_slots = TimeSlot.where(user_id: user_id)
                          .where('? <= start_time', from_time)
                          .where('? >= end_time', to_time)
    pp "acac time slots"
    pp @time_slots

    render json: @time_slots
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

    overlapping_time_slots = TimeSlot.where(user_id: user_id)
                                     .where('? >= start_time AND ? <= end_time', start_time, start_time)
                                     .or(TimeSlot.where('? >= start_time AND ? <= end_time', end_time, end_time))                               
                            
    return render json: {errors: ['Another time slot exists during these start and end times']}, 
           status: :unprocessable_entity if overlapping_time_slots.length > 0

    @time_slot = TimeSlot.new(start_time: start_time_string, end_time: end_time.iso8601, user_id: user_id)

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
      params.permit(:user_id, :start_time, :from_time, :to_time)
    end
end
