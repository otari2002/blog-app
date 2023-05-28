function getArticles(take = 10, skip = 0, category="") {
  if(category==""){
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/articles?take=${take+1}&skip=${skip}`,
        method: 'GET',
        dataType: 'json',
        success: (data) => {
          stillMorePages = [...data].length > 10;
          const articleHTML = (article, index)=>{
            const contentPreview = article.content.substring(0, 30) + '...';
            const articleCategories = article.categories.map((category) => category.name).join(", ");
            return `
            <div class="col">
              <div class="card text-center">
                <img src="${article.imageUrl}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title"><a role="button" class="card-link" id="article${index}" data-id="${article.id}">${article.title}</a></h5>
                  <h6 class="authorName" id="author${index}"><a role="button" class="card-link">By: ${article.authorName}</a></h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">${contentPreview}</li>
                  ${articleCategories.length > 0 ? `<li class="list-group-item">${articleCategories}</li>` : ""}
                </ul>
              </div>
            </div>`
          };
          var articles;
          if(!stillMorePages){
            $("#nextPage").hide();
            articles = data.map(articleHTML).join('');
          }else{
            articles = data.slice(0,-1).map(articleHTML).join('');
          }
          $("#listZone").html([`<div class="row row-cols-1 row-cols-md-2 g-4" id="listZone">`,articles,'</div>'].join(''));

        },
        error: (error) => {
          reject(error); 
        }
      });
    });
  }else{
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/categories/${category}?take=${take+1}&skip=${skip}`,
        method: 'GET',
        dataType: 'json',
        success: (data) => {
          stillMorePages = [...data].length > 10;
          const articleHTML = (article, index)=>{
            const contentPreview = article.content.substring(0, 30) + '...';
            const articleCategories = article.categories.map((category) => category.name).join(", ");
            return `
            <div class="col">
              <div class="card text-center">
                <img src="${article.imageUrl}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title"><a role="button" class="card-link" id="article${index}" data-id="${article.id}">${article.title}</a></h5>
                  <a role="button" class="card-link"><h6 class="authorName" id="author${index}">By: ${article.authorName}</h6></a>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">${contentPreview}</li>
                  ${articleCategories.length > 0 ? `<li class="list-group-item">${articleCategories}</li>` : ""}
                </ul>
              </div>
            </div>`
          };
          var articles;
          if(!stillMorePages){
            $("#nextPage").hide();
            articles = data.map(articleHTML).join('');
          }else{
            articles = data.slice(0,-1).map(articleHTML).join('');
          }
          
          $("#listZone").html([`<div class="row row-cols-1 row-cols-md-2 g-4" id="listZone">`,articles,'</div>'].join(''));

        },
        error: (error) => {
          reject(error); 
        }
      });
    });
  }
}

function showArticlesbyAuthor(author, take=10, skip=0){
  getArticlesPerAuthor(author, take, skip).then((data) => {
    const articleHTML = (article, index)=>{
      const contentPreview = article.content.substring(0, 30) + '...';
      const articleCategories = article.categories.map((category) => category.name).join(", ");
      return `
      <div class="col">
        <div class="card text-center">
          <img src="${article.imageUrl}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title"><a role="button" class="card-link" id="article${index}" data-id="${article.id}">${article.title}</a></h5>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">${contentPreview}</li>
            ${articleCategories.length > 0 ? `<li class="list-group-item">${articleCategories}</li>` : ""}
          </ul>
        </div>
      </div>`
    };
    var articles = data.filter(x=>x.published==true).map(articleHTML).join('');
    $("#title").text(`Articles by ${author}`);
    $("#listZone").html([`<div class="row row-cols-1 row-cols-md-2 g-4" id="#listZone">`,articles,'</div>'].join(''));
  });
}

function getArticlesToDelete(author, take=10, skip=0){ 
  getArticlesPerAuthor(author, take, skip).then((data) => {
    console.log(data.length);
    stillMorePages = [...data].length > 10;
    const articleHTML = (article, index)=>{
      const contentPreview = article.content.substring(0, 30) + '...';
      const articleCategories = article.categories.map((category) => category.name).join(", ");
      return `
      <div class="col">
        <div class="card text-center">
          <img src="${article.imageUrl}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title"><a role="button" class="card-link" id="delete${index}" data-id="${article.id}">${article.title}</a></h5>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">${contentPreview}</li>
            ${articleCategories.length > 0 ? `<li class="list-group-item">${articleCategories}</li>` : ""}
          </ul>
        </div>
      </div>`
    };
    var articles;
    if(!stillMorePages){
      $("#nextPageDelete").hide();
      articles = data.map(articleHTML).join('');
    }else{
      articles = data.slice(0,-1).map(articleHTML).join('');
    }
    $("#title").text("Articles to Delete");
    $("#articlesToEdit").html([`<div class="row row-cols-1 row-cols-md-2 g-4" id="articlesToEdit">`,articles,'</div>'].join(''));
  });
}

function getArticlesToUpdate(author, take=10, skip=0){ 
  getArticlesPerAuthor(author, take, skip).then((data) => {
    stillMorePages = [...data].length > 10;
    const articleHTML = (article, index)=>{
      const contentPreview = article.content.substring(0, 30) + '...';
      const articleCategories = article.categories.map((category) => category.name).join(", ");
      return `
      <div class="col">
        <div class="card text-center">
          <img src="${article.imageUrl}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title"><a role="button" class="card-link" id="update${index}" data-id="${article.id}">${article.title}</a></h5>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">${contentPreview}</li>
            ${articleCategories.length > 0 ? `<li class="list-group-item">${articleCategories}</li>` : ""}
          </ul>
        </div>
      </div>`
    };
    var articles;
    if(!stillMorePages){
      $("#nextPageUpdate").hide();
      articles = data.map(articleHTML).join('');
    }else{
      articles = data.slice(0,-1).map(articleHTML).join('');
    }
    $("#title").text("Articles to Update");
    $("#articlesToEdit").html([`<div class="row row-cols-1 row-cols-md-2 g-4" id="articlesToEdit">`,articles,'</div>'].join(''));

  });
}

function getCategories(arrayOnly=false) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/categories',
      method: 'GET',
      dataType: 'json',
      success: (data) => {
        if(arrayOnly){
          resolve(data);
        }else{
          const categories = data.reverse().map((categorie, index)=>{
            return `
            <div class="col category">
              <div class="card text-center">
                <div class="card-body">
                  <h5><a role="button" class="card-link"  id="category${index}">${categorie.name}</a></h5>
                  <span class="number">${categorie.count}${categorie.count > 1 ? " articles" : " article"}</span>
                </div>
              </div>
            </div>`
          }).join('');
          $("#categoriesZone").html(['<div class="row row-cols-3 row-cols-md-3 g-4" id="categoriesZone">',categories,'</div>'].join(''));  
        }
        },
      error: (error) => {
        reject([]);
      }
    });
  });
}

function setCategoriesCheckbox(editType){
  getCategories(true).then((data)=>{
    const categories = data.reverse().map((categorie,index)=>{
      return `
      <div class="checkbox">
        <label>
            <input type="checkbox" id="${editType}box${index}" value="${categorie.name}"><span>${categorie.name}</span>
        </label>
      </div>	`
    }).join('');
    $(`#${editType}catsCheckbox`).html([`<div class="d-flex flex-wrap" id="${editType}catsCheckbox">`,categories,'</div>'].join(''));  
  })
}

function getCategoriesCount() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/categories',
      method: 'GET',
      dataType: 'json',
      success: (data) => {
        resolve(data.length);
      },
      error: (error) => {
        reject(0);
      }
    });
  });
}

function getArticlesPerAuthor(author, take, skip){
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/users/${author}?take=${take+1}&skip=${skip}`,
      method: 'GET',
      dataType: 'json',
      success: (data) => {
        resolve(data);
      },
      error: (error) => {
        reject(0);
      }
    });
  });
}

function showArticle(id){
  getArticle(id).then((article)=>{
    var [date, time] = article.updatedAt.split("T");
        time = time.split(".")[0];
        $("#title").text(article.title);
        var articleHTML = `
        <p class="content">${article.content}</p>
        <div class="articleDetails">
          <p>Written by : <strong> ${article.authorName} </strong></p>
          <p>Updated At : <strong> ${date+" "+time} </strong></p>
        </div>`
        $("#article").html(articleHTML);
  })
}

function getArticle(id){
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/articles/${id}`,
      method: 'GET',
      dataType: 'json',
      success: (article) => {
        resolve(article);
      },
      error: (error) => {
        reject(error); 
      }
    });
  });
}

function getCommentsByID(id){
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/comments/${id}`,
      method: 'GET',
      dataType: 'json',
      success: (data) => {
        var comments;
        if(data.length > 0){
          comments = `<h4>${data.length} Comments</h4>`+data.map((comment)=>{
            return `
              <div class="text-justify mt-4">
                <h5>${comment.authorEmail}</h5>
                <p>${comment.content}</p>
              </div>`;
          }).join('');
        }else{
          comments = `
          <div class="text-justify mt-4">
            <h5>No Comments for this article</h5>
          </div>`;
        }
        $("#commentsList").html(comments);
        $("#commentForm").attr("data-id",id);
      },
      error: (error) => {
        reject(error); 
      }
    });
  });
}

function postArticle(article, num){
  return new Promise(()=>{
    $.ajax({
      url: "/articles",
      method: "POST",
      contentType: 'application/json',
      data: JSON.stringify(article),
      success: async ()=>{
        $("#addForm input[name='title']").val("");
        $("#addForm input[name='imageUrl']").val("");
        $("#addForm textarea[name='content']").val("");
        if($(`#publish0`).is(':checked')) $("#publish0").prop('checked', false);
        await $.each(Array.from(Array(num).keys()), function(index){
          if($(`#addbox${index}`).is(':checked')){
            $(`#addbox${index}`).prop('checked', false);
          }
        })
        fadingAlert("Article added Successfully !","#4caf50");
      },
      error: (error)=>{
        fadingAlert("An error has occured !","#4caf50");
        console.log(error);
      }
    });
  })
}

function updateArticle(article){
  return new Promise(()=>{
    $.ajax({
      url: "/articles",
      method: "PATCH",
      contentType: 'application/json',
      data: JSON.stringify(article),
      success: ()=>{
        $("#author").trigger("click");
        fadingAlert("Article Updated Successfully !","#1242d1");
      },
      error: (error)=>{
        fadingAlert("An error has occured !","#1242d1");
        console.log(error);
      }
    });
  })
}

function deleteArticle(id){
  return new Promise(()=>{
    $.ajax({
      url: `/articles/${id}`,
      type: "DELETE",
      success: ()=>{
        $("#author").trigger( "click" );
        fadingAlert("Article deleted Successfully !","#4CAF50");
      },
      error: (error)=>{
        fadingAlert("An error has occured !","#e53d3d");
        console.log(error);
      }
    });
  })
}

function postComment(comment){
  return new Promise(()=>{
    $.ajax({
      url: "/comments",
      method: "POST",
      contentType: 'application/json',
      data: JSON.stringify(comment),
      success: ()=>{
        getCommentsByID(comment.articleId);
      },
      error: (error)=>{
        fadingAlert("An error has occured !","#e53d3d");
        console.log(error);
      }
    });
  })
}

function showCategoriesToDelete(){
  getCategories(true).then((data)=>{
    $("#adminActions").hide();
    $("#addCatContainer").show();
    $("#categoriesList").show();
    const categoryHTML = (category, index)=>{
      return `
      <div class="card" style="width:200px;">
        <div class="card-body">
          <h5 class="card-title" id="categoryName${index}" data-name${index}="${category.name}">${category.name}</h5>
          <a role="button" style="color:red;" class="card-link deleteCategory" data-index="${index}"><strong>Delete</strong></a>
        </div>
      </div>`
    };
    var categories = data.map(categoryHTML).join('');
    $("#title").text("Current Categories");
    $("#addCatButton").click(()=>{
      var inputCategory = $("#categoryToAdd").val();
      addCategory(inputCategory);
    })
    $("#categoriesList").html([`<div class="d-flex flex-wrap align-items-center" id="categoriesList">`,categories,'</div>'].join(''));
    $(".deleteCategory").click(function() {
      var index = $(this).data("index");
      var categoryName = $(`#categoryName${index}`).data(`name${index}`);
      deleteCategory(categoryName);
    });
  })
}

function addCategory(name){
  return new Promise(()=>{
    $.ajax({
      url: "/categories",
      method: "POST",
      contentType: 'application/json',
      data: JSON.stringify({"name":name}),
      success: ()=>{
        showCategoriesToDelete();
        fadingAlert("Category added Successfully !","#4CAF50");
      },
      error: (error)=>{
        fadingAlert("An error has occured !","#e53d3d");
        console.log(error);
      }
    });
  })
}

function deleteCategory(name){
  return new Promise(()=>{
    $.ajax({
      url: `/categories/${name}`,
      type: "DELETE",
      success: ()=>{
        showCategoriesToDelete();
        fadingAlert("Category deleted Successfully !","#4CAF50");
      },
      error: (error)=>{
        fadingAlert("An error has occured !","#e53d3d");
        console.log(error);
      }
    });
  })
}

function getAuthors(){
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/users',
      method: 'GET',
      dataType: 'json',
      success: (data) => {
        resolve(data);
      },
      error: (error) => {
        reject([]);
      }
    });
  });
}

function getVerifiedUsersCount(){
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/users',
      method: 'GET',
      dataType: 'json',
      success: (data) => {
        let num = data.filter(x => (x.verified == "ACCEPTED" && x.role == "AUTHOR")).length;
        resolve(num);
      },
      error: () => {
        reject(0);
        alert("An error has occured !")
      }
    });
  });
}

function getUnverifiedUsersCount(){
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/users',
      method: 'GET',
      dataType: 'json',
      success: (data) => {
        let num = data.filter(x => (x.verified == "PENDING" && x.role == "AUTHOR")).length;
        resolve(num);
      },
      error: () => {
        reject(0);
        alert("An error has occured !")
      }
    });
  });
}

function showUsersToDelete(){
  getAuthors().then((data) => {
    $("#adminActions").hide();
    $("#authorsList").show();
    const userHTML = (user, index)=>{
      return `
      <div class="card" style="width:350px;">
        <div class="card-body">
          <h5 class="card-title" id="userName${index}" data-name${index}="${user.name}">${user.name}</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary" id="userEmail${index}">${user.email}</h6>
          <a role="button" style="color:red;" class="card-link deleteAuthor" data-index="${index}"><strong>Delete</strong></a>
        </div>
      </div>`
    };
    var authors = data.filter(x => (x.verified == "ACCEPTED" && x.role == "AUTHOR")).map(userHTML).join('');
    $("#title").text("Current Authors");
    $("#authorsList").html([`<div class="d-flex flex-wrap align-items-center" id="authorsList">`,authors,'</div>'].join(''));
    $(".deleteAuthor").click(function() {
      var index = $(this).data("index");
      var authorName = $(`#userName${index}`).data(`name${index}`);
      deleteAuthor(authorName);
    });
  });
}

function showUnverifiedUsers(){
  getAuthors().then((data) => {
    $("#adminActions").hide();
    $("#authorsList").show();
    const userHTML = (user, index)=>{
      return `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title" id="userName${index}" data-name${index}="${user.name}">${user.name}</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary" id="userEmail${index}">${user.email}</h6>
          <a role="button" style="color:red;" class="card-link deleteAuthor" data-index="${index}"><strong>Delete</strong></a>
          <a role="button" style="color:green;" class="card-link acceptAuthor" data-index="${index}"><strong>Accept</strong></a>
        </div>
      </div>`
    };
    var authors = data.filter(x => (x.verified == "PENDING" && x.role == "AUTHOR")).map(userHTML).join('');
    $("#title").text("Unverified Users");
    $("#authorsList").html([`<div class="d-flex flex-wrap justify-content-center" id="authorsList">`,authors,'</div>'].join(''));
    $(".deleteAuthor").click(function() {
      var index = $(this).data("index");
      var authorName = $(`#userName${index}`).data(`name${index}`);
      deleteAuthor(authorName);
    });
    $(".acceptAuthor").click(function() {
      var index = $(this).data("index");
      var authorName = $(`#userName${index}`).data(`name${index}`);
      acceptAuthor(authorName);
    });
  });
}

function acceptAuthor(username){
  return new Promise(()=>{
    $.ajax({
      url: "/users/accept",
      method: "PATCH",
      contentType: 'application/json',
      data: JSON.stringify({"name": username}),
      success: ()=>{
        showUnverifiedUsers();
        fadingAlert("Author Accepted Successfully !","#1242d1");
      },
      error: (error)=>{
        fadingAlert("An error has occured !","#1242d1");
        console.log(error);
      }
    });
  })
}

function deleteAuthor(name){
  return new Promise(()=>{
    $.ajax({
      url: `/users/${name}`,
      type: "DELETE",
      success: ()=>{
        showUsersToDelete();
        fadingAlert("Author deleted Successfully !","#4CAF50");
      },
      error: (error)=>{
        fadingAlert("An error has occured !","#e53d3d");
        console.log(error);
      }
    });
  })
}

function loggedInUser(){
  return new Promise((resolve)=>{
    $.ajax({
      url: "/login",
      method: 'GET',
      dataType: 'json',
      success: (user) =>{
        resolve(user);
      },
      error: (error)=>{
        console.log("error");
      }
    });
  })
}

function togglePassword(selector){
  var x = $(`${selector} input[name='password']`);
  if (x.attr("type") === "password") {
    x.attr("type","text");
  } else {
    x.attr("type","password");
  }
}

function registerRequest(user){
  return new Promise(()=>{
    $.ajax({
      url: "/users",
      method: "POST",
      contentType: 'application/json',
      data: JSON.stringify(user),
      success: ({message})=>{
        $(".close").trigger("click");
        fadingAlert(message,"#1242d1");
      },
      error: (error)=>{
        fadingAlert("Unable to Register !","#d5241a");
        console.log(error);
      }
    });
  })
}

function loginRequest(user){
  return new Promise(()=>{
    $.ajax({
      url: "/login",
      method: "POST",
      contentType: 'application/json',
      data: JSON.stringify(user),
      success: ()=>{
        $(".close").trigger("click");
        loggedInUser().then((user)=>{
          afterLogin(user.name, user.email, user.role, user.verified);
          $(".commentEmail").hide();
          $(".commentEmail").removeAttr('required');
        });
      },
      error: (error)=>{
        fadingAlert("Unable to Login !","#d5241a");
        console.log(error);
      }
    });
  })
}

function afterLogin(name, email, role, verified){
  $("#loginButton").hide();
  $("#registerButton").hide();
  $("#logoutButton").show();
  userName = name;
  userEmail = email;
  userRole = role;
  if(verified == "ACCEPTED"){
    $("#author").show();
    if(role == "ADMIN") $("#admin").show();
    $("#logoutButton").text(`Logout ${userRole}: ${userName}`);
  }else{
    $("#logoutButton").text(`Logout (Pending): ${userName}`);
  }
}

function afterLogout(){
  $("#author").hide();
  userName = "";
  userEmail = "";
  userRole = "";
}

function emptyInputZones(){
  $("input[name='title']").val("");
  $("input[name='imageUrl']").val("");
  $("textarea[name='content']").val("");
  $("input[name='email']").val("");
  $("input[name='comment']").val("");
}

function resetView(){
  $("#title").show();
  $("#homeDetails").hide();
  $(".pageButtons").show();
  $("#lastPage").hide();
  $("#nextPage").hide();
  $("#lastPageDelete").hide();
  $("#nextPageDelete").hide();
  $("#lastPageUpdate").hide();
  $("#nextPageUpdate").hide();
  $("#listZone").hide();
  $("#categoriesZone").hide();
  $("#article").hide();
  $("#comments").hide();
  $("#authorZone").hide();
  $("#adminZone").hide();
  $("#authorsList").hide();
  $("#addCatContainer").hide();
  $("#categoriesList").hide();
}

function fadingAlert(text, color="red"){
  $(".alert-box").css("background-color",color);
  $(".alert-box p").text(text);
  $(".alert-box").fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
}


var page = 1;
var stillMorePages = true;
var categoryName = "";
var userName = "";
var userEmail = "";
var userRole = "";


$(document).ready(function(){
////checking if the user is logged in 
  $("#logoutButton").hide();
  resetView();
  $("#homeDetails").show();
  loggedInUser().then((user)=>{
    if(user) {
      afterLogin(user.name, user.email, user.role, user.verified);
      $(".commentEmail").hide();
      $(".commentEmail").removeAttr('required');
    };
  });
  //loginForm
  $("#loginModal").on("submit",(evt)=>{
    evt.preventDefault();
    var name = $("#loginModal").find("input[name='username']").val();
    var psw = $("#loginModal").find("input[name='password']").val();
    loginRequest({ "username": name, "password": psw });
  })
  //registerForm
  $("#registerModal").on("submit",(evt)=>{
    evt.preventDefault();
    var username = $("#registerModal").find("input[name='username']").val();
    var email = $("#registerModal").find("input[name='email']").val();
    var password = $("#registerModal").find("input[name='password']").val();
    var user = {
      "name": username,
      "email": email,
      "password": password,
      "role": "AUTHOR"
  }
    registerRequest(user);
  })

////the 5 pages
  $("#home").click(()=>{
    categoryName = "";
    $("#title").text("Blog");
    resetView();
    $("#homeDetails").show();
  });
///////////////////////////////////////////////////////////
  $("#articles").click(()=>{
    page = 1;
    categoryName = "";
    resetView();
    $("#homeDetails").hide();
    $("#title").text("Articles");
    $("#listZone").show();
    $("#nextPage").show();
    getArticles(10,(page-1)*10);
  });
  //article view
  $.each(Array.from(Array(10).keys()), function(index){
    $("#listZone").on("click", `#author${index}`, ()=>{
      page = 1;
      var authorName = $(`#author${index}`).text().replace("By: ","");
      $("#listZone").show();
      $("#nextPage").hide();
      $("#lastPage").hide();
      showArticlesbyAuthor(authorName,10,(page-1)*10);
    });
    $("#listZone").on("click", `#article${index}`, ()=>{
      page = 1;
      resetView();
      emptyInputZones();
      $("#article").show();
      $("#comments").show();
      $("#listZone").hide();
      var articleID = parseInt($(`#article${index}`).attr("data-id"));
      showArticle(articleID);
      getCommentsByID(articleID);
    });
  })
  //posting a comment
  $("#commentForm").on("submit",(evt)=>{
    evt.preventDefault();
    if(userEmail != ""){
      var email = userEmail;
    }else{
      var email = $("#commentForm").find("input[name='email']").val();
    }
    var message = $("#commentForm").find("textarea[name='message']").val();
    var articleID = $("#commentForm").attr("data-id");
    var comment = {
      "content": message,
      "authorEmail": email,
      "articleId": articleID,
    };
    postComment(comment);
    $("input[name='email']").val("");
    $("textarea[name='message']").val("");
  })
  //listView buttons
  $("#nextPage").click(()=>{
    page++;
    window.scrollTo(0, 0);
    getArticles(10,(page-1)*10,categoryName);
    $("#lastPage").show();
  })
  $("#lastPage").click(()=>{
    page--;
    window.scrollTo(0, 0);
    getArticles(10,(page-1)*10, categoryName);
    $("#nextPage").show();
    if(page==1) $("#lastPage").hide();
  })
///////////////////////////////////////////////////////////
  $("#categories").click(()=>{
    resetView();
    $("#homeDetails").hide();
    $("#categoriesZone").show();
    $("#title").text("Categories");
    getCategories();
  });
  //list of articles for each category
  getCategoriesCount().then((num)=>{
    $.each(Array.from(Array(num).keys()), function(index){
      $("#categoriesZone").on("click", `#category${index}`, ()=>{
        resetView();
        $("#listZone").show();
        $("#nextPage").show();
        page = 1;
        var name = $(`#category${index}`).text();
        categoryName = name;
        $("#title").text(name);
        getArticles(10,(page-1)*10, name);
      });
    })
  })
///////////////////////////////////////////////////////////
  $("#author").click(()=>{
    resetView();
    $("#homeDetails").hide();
    $("#authorZone").show();
    $("#authorActions").show();
    $("#articleCreation").hide();
    $("#articleUpdate").hide();
    $("#articlesToEdit").hide();
    $("#title").text("Author Zone");
  })
  //updating an article
  $("#updateButton").click(()=>{
    page=1;
    $("#authorActions").hide();
    $("#lastPage").hide();
    $("#nextPage").hide();
    $("#nextPageDelete").hide();
    $("#nextPageUpdate").show();
    $("#articlesToEdit").show();
    getArticlesToUpdate(userName,10,(page-1)*10);
    setCategoriesCheckbox("update");
  })
  $.each(Array.from(Array(10).keys()), function(index){
    $("#articlesToEdit").on("click", `#update${index}`, ()=>{
      emptyInputZones();
      var articleID = $(`#update${index}`).attr("data-id");
      $("#articleUpdate").show();
      $("#articlesToEdit").hide();
      $("#lastPageUpdate").hide();
      $("#nextPageUpdate").hide();
      getArticle(articleID).then((article)=>{
        var categoriesList = article.categories.map(x=>x.name);
        categoriesList.forEach((value)=>$(`#updateForm input[value='${value}']`).trigger("click"));
        $("#updateForm input[name='title']").val(article.title);
        $("#updateForm input[name='imageUrl']").val(article.imageUrl);
        $("#updateForm textarea[name='content']").val(article.content);
        $("#updateForm #publish1").prop('checked', article.published);
        $("#updateForm input[name='title']").attr( "data-id", articleID);
      })
    });
  })
  $("#updateForm").on("submit",(evt)=>{
    evt.preventDefault();
    var articleID = $("#updateForm input[name='title']").attr( "data-id");
    var title = $("#updateForm input[name='title']").val();
    var imageUrl = $("#updateForm input[name='imageUrl']").val();
    var content = $("#updateForm textarea[name='content']").val();
    var toPublish = $(`#publish1`).is(':checked');
    getCategoriesCount().then(async function(num){
      let categories = [];
      await $.each(Array.from(Array(num).keys()), function(index){
        if($(`#updatebox${index}`).is(':checked')){
          categories.push($(`#updatebox${index}`).val());
        }
      })
      var article = {
        "id" : articleID,
        "title": title,
        "content": content,
        "published": toPublish,
        "imageUrl": imageUrl,
        "authorName": userName,
        "categories": categories
      }
      updateArticle(article);
    })
  })
  //adding an article
  $("#addButton").click(()=>{
    $("#authorActions").hide();
    $("#articleCreation").show();
    emptyInputZones();
    setCategoriesCheckbox("add");
  })
  $("#addForm").on("submit",(evt)=>{
    evt.preventDefault();
    var title = $("#addForm").find("input[name='title']").val();
    var imageUrl = $("#addForm").find("input[name='imageUrl']").val();
    var content = $("#addForm").find("textarea[name='content']").val();
    var toPublish = $(`#publish0`).is(':checked');
    getCategoriesCount().then(async function(num){
      var categories = [];
      await $.each(Array.from(Array(num).keys()), function(index){
        if($(`#addbox${index}`).is(':checked')){
          categories.push($(`#addbox${index}`).val());
        }
      })
      var article = {
        "title": title,
        "content": content,
        "published": toPublish,
        "imageUrl": imageUrl,
        "authorName": userName,
        "categories": categories
      }
      postArticle(article, num);
    })
  })
  //deleting an article
  $("#deleteButton").click(()=>{
    page=1;
    $("#authorActions").hide();
    $("#lastPage").hide();
    $("#nextPage").hide();
    $("#nextPageUpdate").hide();
    $("#nextPageDelete").show();
    $("#articlesToEdit").show();
    getArticlesToDelete(userName,10,(page-1)*10);
  })
  $.each(Array.from(Array(10).keys()), function(index){
    $("#articlesToEdit").on("click", `#delete${index}`, ()=>{
      var articleID = $(`#delete${index}`).attr("data-id");
      deleteArticle(articleID);
    });
  })
  //articles to delete buttons
  $("#nextPageDelete").click(()=>{
    page++;
    window.scrollTo(0, 0);
    getArticlesToDelete(userName,10,(page-1)*10);
    $("#lastPageDelete").show();
  })
  $("#lastPageDelete").click(()=>{
    page--;
    window.scrollTo(0, 0);
    getArticlesToDelete(userName,10,(page-1)*10);
    $("#nextPageDelete").show();
    if(page==1) $("#lastPageDelete").hide();
  })
  //articles to update buttons
  $("#nextPageUpdate").click(()=>{
    page++;
    window.scrollTo(0, 0);
    getArticlesToUpdate(userName,10,(page-1)*10);
    $("#lastPageUpdate").show();
  })
  $("#lastPageUpdate").click(()=>{
    page--;
    window.scrollTo(0, 0);
    getArticlesToUpdate(userName,10,(page-1)*10);
    $("#nextPageUpdate").show();
    if(page==1) $("#lastPageUpdate").hide();
  })
///////////////////////////////////////////////////////////
  $("#admin").click(()=>{
    resetView();
    $("#title").text("Admin Zone");
    $("#homeDetails").hide();
    $("#adminZone").show();
    $("#adminActions").show();
    getVerifiedUsersCount();
  })
  //Deleting cureent authors
  $("#authorDelete").click(showUsersToDelete);
  //Accepting new authors
  $("#authorAccept").click(showUnverifiedUsers);
  $("#categoryManage").click(showCategoriesToDelete);
})
