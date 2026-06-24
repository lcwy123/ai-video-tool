"""add avatars table

Revision ID: 004
Revises: 003
"""
from alembic import op
import sqlalchemy as sa


revision = "004"
down_revision = "003"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "avatars",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("portrait", sa.String(500), nullable=True),
        sa.Column("model_3d_url", sa.String(500), nullable=True),
        sa.Column("voice_preset", sa.Text(), nullable=True),
        sa.Column("personality", sa.Text(), nullable=False, server_default=""),
        sa.Column("avatar_style", sa.String(20), nullable=False, server_default="写实"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )


def downgrade():
    op.drop_table("avatars")
