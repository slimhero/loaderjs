Loader = {
  // ##Constant## 
  VERSION: "0.0.2",
  DESCRIPTION:  "Simple, lightweigth fileloader",
  CMD_DELIMITER: '!',
  DEBUG: true,
 
  // ## Loader.log ##
  // Wrapper for console.log.
  // Works when Loader.DEBUG is true
  log: function( message ) {
    if( this.DEBUG )
      console.log( message );
  },

  // ## Loader.get
  /**
   * Loader.get function for loading file
   * Parameters:
   *   @cmd [String] - consists url or cmd and url
   *   @callback [fucntion] - function which run then file is loaded 
   * Exapmple:
   *   Loader.get( 'test.js', function(){ alert("Hi!"); } );
   *   Loader.get( 'css!test.css', function(){ alert("Hi!"); } );
   */   
  get: function(cmd, callback){
    // URL of file
    var url = "";
    // Method name for loading file
    var method = "";
    // Using Component.Loader.CMD_DELIMITER and split() to
    // cut string on 2 but in array
    var aData = cmd.split( this.CMD_DELIMITER );
    // Think about 2 way
    // when the cmd consists only url
    if( aData.length == 1 ){
      method = "js";
      url = aData[0];
    }
    // and the cmd consists command and url
    else if( aData.length == 2 ) {
      method = aData[0];
      url = aData[1]
    };

    // After that run plugin by method name
    // It's like a link to Component.Loader.plugins
    this.plugins[ method ].call( 
        null, 
        url, 
        function(){
          if( callback && (typeof callback !== 'undefined') )  
            callback(); 
        } 
    );
  },
    
  // ## Loader.plugins ##
  plugins: {
    // ## Loader.plugins.js ##
    // Plugin to load js files. Uses as default  
    // Runs from Loader.get 
    /**
     * Load js files.  Uses as default
     * Parameters:
     *   @ulr [String] - URL
     *   @callback [function] - callback function
     */
    js: function(url, callback){
      // Get list of script element
      var aScripts = document.getElementsByTagName("script");
      // Existing-file state
      var IsScriptExist = false;
      // Check if file exists.
      // Compare each aScripts-item url with url-parameter
      for( var i = 0; i < aScripts.length; i++ ){
        var src = aScripts[i].getAttribute("src");
        // If equal url is found set IsScriptExist as true
        // and go out from for-block
        if( src == url ){
          IsScriptExist = true;
          break;
        }
      }
      // if we don't find script
      if( !IsScriptExist ){  
        var script = document.createElement("script")
        script.type = "text/javascript";
        // Block for IE
        if (script.readyState){
          script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                  script.readyState == "complete"){
              script.onreadystatechange = null;
              if( callback && (typeof callback !== 'undefined') )  
                callback();
              Loader.log( url + " has loaded");
            }
          };
        }
        // Block for others browsers 
        else {
          script.onload = function(){
            if( callback && (typeof callback !== 'undefined') )  
              callback();
            Loader.log( url + " has loaded");
          };
        };

        script.src = url;
        // Add to head element
        document.getElementsByTagName("head")[0].appendChild(script);
      }
      // If file exists - run callback function
      else{
        if( callback && (typeof callback !== 'undefined') )  
          callback();
        Loader.log( url + " is exists");        
      }
    },

    // ## Loader.plugins.css ##
    // Plugin to load css files.   
    // Runs from Loader.get 
    /**
     * Load js files.  Uses as default
     * Parameters:
     *   @ulr [String] - URL
     *   @callback [function] - callback function
     */
    css: function( url, collback ){
      var cssNode = document.createElement('link');
      cssNode.type = 'text/css';
      cssNode.rel = 'stylesheet';
      cssNode.href = url;
      cssNode.media = 'screen';
      document.getElementsByTagName("head")[0].appendChild(cssNode);
      callback();
    }
  },

  // ## Loader.Manager ##
  // Load several files 
  /**
   * Load several files one-by-one and run callback 
   * function when all fileswill be loaded
   * Parameters:
   *   @aFiles [String array] - String array of file URL
   *   @callback [function] - callback function
   *   @error [function] - run when problem with loadin files
   * Examples:
   *   Loader.Manager( 
   *     ['/testlib.js','css!/test.css'], 
   *     function(){ alert("Everything has loaded!"); } 
   *   ); 
   */
  Manager: function( aFiles, callback, error ){
    // Recursively call Loader.get to load file
    (function(){
      if( aFiles.length > 0 ){  
        var f = aFiles.shift();
        if( aFiles.length > 0 ){   
          Loader.get( 
            f, 
            (function(a,c,e){
              return function() {
                Loader.Manager( a, c, e  );
              };
            })(aFiles, callback, error ) 
          ); 
        }
        else{
          Loader.get( f, callback, error );
        }
      };
    }());
  },

  // ## Loader.config ##
  /**
   * Set configuratin, when loader is loaded
   */
  config: function(){
    // Find list of scripts
    var aScripts = document.getElementsByTagName("script");
    // List of files from data-main
    var aMain = [];

    // Trying to fill aMain
    for( var x = 0; x < aScripts.length; x++ ){
      var node = aScripts[x];
      var main = node.getAttribute("data-main");
      if( main ){
        aMain.push( main );
      }
    };
    // If aMain has a length more then 0 run Loader.Manager
    if( aMain.length > 0 ){
      Loader.Manager( aMain );
    };
  }
};

// Start Loader.config after loading file
Loader.config();

