# Good Tunes API

## Requirements

Until I set Docker up then I am working with the following

* Nginx v1.6.1
* MongoDB v3
* Node v0.12.0

## Config

Contact me for the config

## Running on Docker

* Download & install Docker [https://github.com/boot2docker/osx-installer/releases/tag/v1.7.0](https://github.com/boot2docker/osx-installer/releases/tag/v1.7.0)
* Create a Boot2Docker VM: `$ boot2docker init`
* Start the Boot2Docker VM: `$ boot2docker start`
* Set the environment variables: `$ eval "$(boot2docker shellinit)"`
* Install Docker Compose: ``curl -L https://github.com/docker/compose/releases/download/1.2.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose``
* cd into this repo
* Run the app: `$ docker-compose up` (or `$ docker-compose up -d` to run in background)
* Find out what IP your Boot2Docker VM is running on: `$ boot2docker ip`
* Browse to http://[boot2dockerip]:3000
* `$ docker-compose stop` to stop everything

## Quick and dirty seed data
* Add user: `curl --data "email=paul@paulcarvill.com&name=paul&password=foobar123" http://192.168.59.103:3000/v1/users`
* Read user (using auth): `curl -H "Authorization: Bearer 0a7a4eac-092d-42eb-89cd-9cc89876dc88" 192.168.59.103:3000/v1/users/5587eb168df35601008765e5`