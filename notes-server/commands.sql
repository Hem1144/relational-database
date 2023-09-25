//! Create the blogs table
CREATE TABLE blogs (
    id serial PRIMARY KEY,
    author varchar(255),
    url varchar(255) NOT NULL,
    title varchar(255) NOT NULL,
    likes integer DEFAULT 0
);


-- Read data from table
select * from blogs;

//! Insert data values into table 

INSERT INTO blogs (author, url, title, likes)
VALUES ('Author 1', 'https://example.com/blog1', 'Blog Title 1', 10);


INSERT INTO blogs (author, url, title, likes)
VALUES ('Author 2', 'https/myBlog.com', 'Blog Title 2', 5);