class UpdateBookingsIndexTimeSlotId < ActiveRecord::Migration[7.2]
  def change
    remove_index :bookings, [ :time_slot_id, :user_id ]
    remove_index :bookings, [ :time_slot_id ]
    add_index :bookings, [ :time_slot_id ], unique: true
  end
end
