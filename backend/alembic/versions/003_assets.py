"""add assets table

Revision ID: 003
Revises: 002
"""
from alembic import op
import sqlalchemy as sa


revision = "003"
down_revision = "002"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "assets",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("project_id", sa.Uuid(), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("asset_type", sa.String(20), nullable=False),
        sa.Column("url", sa.String(500), nullable=False),
        sa.Column("thumbnail", sa.String(500), nullable=True),
        sa.Column("file_size", sa.Integer(), nullable=True),
        sa.Column("source", sa.String(20), nullable=False, server_default="uploaded"),
        sa.Column("file_name", sa.String(255), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index(op.f("ix_assets_project_id"), "assets", ["project_id"])


def downgrade():
    op.drop_index(op.f("ix_assets_project_id"), table_name="assets")
    op.drop_table("assets")
