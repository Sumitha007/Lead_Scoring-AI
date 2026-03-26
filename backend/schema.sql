CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'employee')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(32) NOT NULL,
  category VARCHAR(20) NOT NULL,
  company VARCHAR(255),
  budget DOUBLE PRECISION,
  website_visits INT NOT NULL DEFAULT 0,
  -- User behavior tracking fields
  time_spent_seconds INT NOT NULL DEFAULT 0,
  clicks INT NOT NULL DEFAULT 0,
  pages_visited INT NOT NULL DEFAULT 0,
  add_to_cart INT NOT NULL DEFAULT 0,
  product_views INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interactions (
  id CHAR(36) PRIMARY KEY,
  lead_id CHAR(36) NOT NULL,
  interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('call', 'email', 'meeting')),
  payload JSON NOT NULL,
  created_by_user_id CHAR(36) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_interactions_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
  CONSTRAINT fk_interactions_user FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS scores (
  id CHAR(36) PRIMARY KEY,
  lead_id CHAR(36) UNIQUE NOT NULL,
  score_probability DOUBLE PRECISION NOT NULL,
  recommendation VARCHAR(120) NOT NULL,
  explanation_json JSON NOT NULL,
  model_version VARCHAR(40) NOT NULL,
  summary TEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_scores_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);
