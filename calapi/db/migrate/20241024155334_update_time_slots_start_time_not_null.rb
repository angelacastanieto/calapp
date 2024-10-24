class UpdateTimeSlotsStartTimeNotNull < ActiveRecord::Migration[7.2]
  def change
    change_column_null :time_slots, :start_time, false
  end
end
