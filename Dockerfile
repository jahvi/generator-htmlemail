# https://github.com/dwightjack/grunt-email-boilerplate

# Pull base image.
FROM ubuntu
MAINTAINER Javier Villanueva

RUN sed -i 's/# \(.*multiverse$\)/\1/g' /etc/apt/sources.list
RUN apt-get update 
RUN DEBIAN_FRONTEND=noninteractive apt-get -y upgrade 

# Install Ruby
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y ruby ruby-dev

# Install build essentials (needed to build gems)
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y build-essential software-properties-common
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y curl git 
#RUN DEBIAN_FRONTEND=noninteractive apt-get install -y python python-dev python-pip python-virtualenv

# Dependencies
RUN gem install compass
RUN gem install premailer 
RUN gem install hpricot

# Install node.js
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs npm
RUN apt-get install -y nodejs-legacy 
RUN apt-get install -y libpng-dev

RUN npm install -g grunt 
RUN npm install -g yo
RUN npm install -g generator-htmlemail

# Set environment variables.
ENV HOME /root

# Define mountable directories.
VOLUME ["data"]

# Define working directory.
WORKDIR /data

# Define default command.
RUN echo initiate the generator in an empty directory with 'yo htmlemail'

EXPOSE 8000
