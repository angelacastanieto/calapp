class CreateBookings < ActiveRecord::Migration[7.2]
  def change
    create_table :bookings do |t|
      t.integer :satisfaction_score
      t.text :notes

      t.timestamps
    end

    add_reference :bookings, :user, index: true, foreign_key: true
    add_reference :bookings, :time_slot, index: true, foreign_key: true
    add_index :bookings, [ :time_slot_id, :user_id ], unique: true
  end
end
