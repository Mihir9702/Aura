from pydantic import SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="AURA_", env_file=".env", extra="ignore")
    database_url: SecretStr
    owner_key: SecretStr

    @field_validator("owner_key")
    @classmethod
    def valid_key(cls, value: SecretStr) -> SecretStr:
        if len(value.get_secret_value()) < 32 or "REPLACE" in value.get_secret_value():
            raise ValueError("A random owner key of at least 32 characters is required")
        return value
