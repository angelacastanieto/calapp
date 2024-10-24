class AddEndTimeToTimeSlots < ActiveRecord::Migration[7.2]
  def change
    add_column :time_slots, :end_time, :timestamp, null: false
  end
end
