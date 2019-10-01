CREATE TABLE calandar_events(
    id INTEGER,
    create_date INTEGER,
    modified_date INTEGER,
    event_date INTEGER,
    title TEXT,
    description TEXT,
    is_visible INTEGER,
    visible_name TEXT,
    notify_before_date INTEGER
);


CREATE TABLE text_file(
    id INTEGER,
    create_date INTEGER,
    modified_date INTEGER,
    file_name TEXT,
    data TEXT
);

CREATE TABLE text_image(
    id INTEGER,
    create_date INTEGER,
    modified_date INTEGER,
    file_name TEXT,
    data BLOB
);