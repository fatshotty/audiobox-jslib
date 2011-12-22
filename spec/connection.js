describe("connection", function(){

  it('user should be logged', function(){

    var user = AudioBox.User;

    user.load(username, password)
      .on("beforeSend", function(){})
      .on("complete", function(){})
      .on("success", function(){
        expect(this.email).toBeDefined();
      })
      .on("error", function(status, description){
        expect(status).toNotEqual(200);
        expect(description).toBeDefined();
      });

  });


  it('should be return all playlists', function(){

    var user = AudioBox.User;

    user.load()
      .on("success", function(){

        this.playlists.load()
          .on("beforeSend", function(){

          })
          .on("complete", function(){

          })
          .on("success", function(){
            expect(this.playlists.size).toNotEqual(0);
          })
          .on("error", function(){
            expect(this.playlists.size).toEqual(0);
          });

      });

  });


});