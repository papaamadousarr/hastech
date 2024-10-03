    @extends('main')
    @section('content')

    <div class="row">
            <div class="col-md-12" id="contact_data">
                <h1>Contact US {{$data['fullname']}} and email {{$data['email']}}</h1>

                <form id="contact form">
<div class="form-group">
    <label for="name">Your Name</label>
    <input type="text" class="form-control" id="u_name" placeholder="Name">
  </div>
  <div class="form-group">
    <label for="email">Email</label>
    <input type="text" class="form-control" id="u_email" placeholder="Email">
  </div>
 
 <div class="form-group">
    <label for="subject">Subject</label>
    <npiut type="text" class="form-control" id="u_subject" placeholder="Subject">
  </div>
 
 <div class="form-group">
    <label for="name">Your Name</label>
    <textarea class="form-control" id="u_name" placeholder="Name">Your Messege here...</textarea>
  </div>
 
 
  
  
  
  <button type="submit" class="btn btn-primary center-block">Submit</button>
</form>
            </div>
        </div>
@endsection