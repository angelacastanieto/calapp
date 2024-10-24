class UpdateUsersType < ActiveRecord::Migration[7.2]
  def change
    change_column_null :users, :type, false
    rename_column :users, :type, :user_type
  end
end
