class CreateTimeSlots < ActiveRecord::Migration[7.2]
  def change
    create_table :time_slots do |t|
      t.timestamp :start_time

      t.timestamps
    end

    add_reference :time_slots, :user, index: true, foreign_key: true
    add_index :time_slots, [ :start_time, :user_id ], unique: true
  end
end
