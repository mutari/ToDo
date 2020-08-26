DROP DATABASE Todo;

CREATE DATABASE Todo;

CREATE TABLE frames (
    ID int NOT NULL AUTO_INCREMENT,
    NAME varchar(255),
    USERS_ID int, -- the owner of the frame
    TIME_CREATED DATE
)

CREATE TABLE cards (
    ID int NOT NULL AUTO_INCREMENT,
    TITLE varchar(255),
    DISCRIPTION varchar(255),
    BOX_ID int,
    LOOK_AT BOOL
)

CREATE TABLE boxs (
    ID int NOT NULL AUTO_INCREMENT
    TITLE varchar(255),
    FRAME_ID int
)

-- members of a frame(not owner)
CREATE TABLE members (
    USER_ID int,
    FRAME_ID int
)

CREATE TABLE users (
    ID int NOT NULL AUTO_INCREMENT,
    NAME varchar(255)
    PASSWORD varchar(255)
    EMAIL varchar(255)
)