class StoriesController < ApplicationController

  def index
    @stories = Company.find(params[:id]).stories
  end

  def new
    @story = Story.new
  end

  def show
    @story = Story.find params[:id]
  end

  def edit
  end

  def create
  end

  def update
  end

  def destroy
  end

end
