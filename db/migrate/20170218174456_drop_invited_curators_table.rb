class DropInvitedCuratorsTable < ActiveRecord::Migration

  def up
    drop_table :invited_curators
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end

end
