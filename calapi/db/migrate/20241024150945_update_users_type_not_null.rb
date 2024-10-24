class UpdateUsersTypeNotNull < ActiveRecord::Migration[7.2]
  def change
    change_column_null :users, :type, false
  end
end
