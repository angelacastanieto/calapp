class User < ApplicationRecord
  has_many :bookings, dependent: :destroy
  has_many :time_slots, dependent: :destroy

  enum user_type: { coach: 0, student: 1 }

  def is_coach
    user_type == "coach"
  end

  def is_student
    user_type == "student"
  end
end
