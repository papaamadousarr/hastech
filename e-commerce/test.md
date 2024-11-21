##Ecommerce With Golang Project 

# You can start the project with below commands
docker-compose up -d Does not work instead try: go run main.go


    *** SIGNUP FUNCTION API CALL (POST REQUEST) ***
    

http://localhost:8080/users/signup

{
  "first_name": "papa",
  "last_name": "Sarr",
  "email": "psarr@gmail.com",
  "password": "pass1234",
  "phone": "+4534545435"
}

Response :"Successfully Signed Up!!"

    LOGIN FUNCTION API CALL (POST REQUEST)

    http://localhost:8800/users/login

{
  "email": "psarr@gmail.com",
  "password": "pass1234"
}



    Admin add Product Function (POST REQUEST)

    http://localhost:8080/admin/addproduct

{
  "product_name": "car opel x15",
  "price": 2500,
  "rating": 10,
  "image": "opel.jpg",
  "noserie": "7635533816"
}

Response : "Successfully added our Product Admin!!"

    View all the Products in db GET REQUEST

    http://localhost:8080/users/productview

Response

[
  {
    "Product_ID": "6153ff8edef2c3c0a02ae39a",
    "product_name": "car opel x15",
    "price": 1500,
    "rating": 10,
    "image": "opel.jpg",
    "moserie":"7635533816"
  }
]

    Search Product by regex function (GET REQUEST)

defines the word search sorting http://localhost:8000/users/search?name=op


defines the word search sorting http://localhost:8000/users/search?no=763

response:

[
  {
    "Product_ID": "616152fa9f29be942bd9df91",
    "product_name": "car opel x15",
    "price": 1500,
    "rating": 10,
    "image": "opel.jpg"
    "noserie":"7635533816"
  }
]

   
