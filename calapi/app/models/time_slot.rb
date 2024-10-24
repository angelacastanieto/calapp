class TimeSlot < ApplicationRecord
  belongs_to :user
  has_one :booking, dependent: :destroy
end
