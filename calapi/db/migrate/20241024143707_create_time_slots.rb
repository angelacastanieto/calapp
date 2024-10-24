class CreateTimeSlots < ActiveRecord::Migration[7.2]
  def change
    create_table :time_slots do |t|
      t.timestamp :start_time

      t.timestamps
    end
  end
end
