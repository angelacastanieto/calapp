class User < ApplicationRecord
  has_many :bookings, dependent: :destroy
  has_many :time_slots, dependent: :destroy
end
