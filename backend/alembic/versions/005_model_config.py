"""add model_config to projects

Revision ID: 005
Revises: 004
"""
from alembic import op
import sqlalchemy as sa

revision = "005"
down_revision = "004"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("projects", sa.Column("model_config", sa.Text(), nullable=True))


def downgrade():
    op.drop_column("projects", "model_config")
