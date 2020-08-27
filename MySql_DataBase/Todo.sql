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
    COLOR int,
    TIME_CREATED DATE
)

--asigned to a card
CREATE TABLE card_member (
    CARD_ID int
    USER_ID int 
)

CREATE TABLE task (
    ID int NOT 
    CARD_ID int
)

CREATE TABLE task_question (
    TASK_ID int,
    TITLE varchar(255),
    QUEUE int,
    STATE BOOLEAN
)

CREATE TABLE task_members {
    TASK_QUESTION_ID int
    USER_ID int
}

CREATE TABLE labels (
    CAR_ID int 
    TITLE varchar(255)
)

CREATE TABLE boxs (
    ID int NOT NULL AUTO_INCREMENT
    TITLE varchar(255),
    FRAME_ID int,
    COLOR int,
    QUEUE int
)

-- members of a frame(not owner)
CREATE TABLE members (
    USER_ID int,
    FRAME_ID int,
    TIME_JOINED DATE
)

CREATE TABLE users (
    ID int NOT NULL AUTO_INCREMENT,
    NAME varchar(255),
    PASSWORD varchar(255),
    EMAIL varchar(255),
    PROFILE_IMG_LINK varchar(255)
    TIME_JOINED DATE
)