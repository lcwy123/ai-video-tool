"""add scenes table

Revision ID: 002
Revises: 001
"""
from alembic import op
import sqlalchemy as sa


revision = "002"
down_revision = "001"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "scenes",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("project_id", sa.Uuid(), sa.ForeignKey("projects.id"), nullable=False),
        sa.Column("order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("duration", sa.Integer(), nullable=False, server_default="10"),
        sa.Column("script", sa.Text(), nullable=False, server_default=""),
        sa.Column("voiceover_id", sa.Uuid(), nullable=True),
        sa.Column("background_id", sa.Uuid(), nullable=True),
        sa.Column("avatar_action", sa.String(500), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index(op.f("ix_scenes_project_id"), "scenes", ["project_id"])


def downgrade():
    op.drop_table("scenes")
