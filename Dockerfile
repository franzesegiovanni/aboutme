FROM ruby:3.1

WORKDIR /site

# Install build dependencies (some gems may need these)
RUN apt-get update -y && apt-get install -y --no-install-recommends \
		build-essential \
		git \
	&& rm -rf /var/lib/apt/lists/*

# Cache bundler gems: copy only Gem* first
COPY Gemfile Gemfile.lock ./
RUN gem install bundler && bundle config set path 'vendor/bundle' && bundle install

# Now copy the rest of the project
COPY . .

EXPOSE 4000

# Use 0.0.0.0 host so container is reachable; enable live reload optionally via env
ENV JEKYLL_ENV=development
CMD ["bundle", "exec", "jekyll", "serve", "--config", "_config.yml,_config.dev.yml", "--host", "0.0.0.0", "--livereload"]