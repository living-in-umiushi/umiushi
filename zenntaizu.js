$(function(){


    $("[name=radio_button]").click( function() {
    
        //まずイベントを全削除する
        $( "#canvas" )[0].removeEventListener('mousedown', put_stemp , { passive: true });
        $( "#canvas" )[0].removeEventListener('mousedown', marker_mousedown , { passive: true });
        $( "#canvas" )[0].removeEventListener('mousemove', marker_mousemove , { passive: true });
        $( "#canvas" )[0].removeEventListener('mousemove', eraser_mousemove , { passive: true });
        $( "#canvas" )[0].removeEventListener('mouseup', marker_mouseup , { passive: true });

        //選択されたラジオボタン情報を取得する
        var radioVal = $("input[name='radio_button']:checked").val();

        //[文字スタンプ]が選択された時
        if( radioVal === "1" ){
            $( "#canvas" )[0].addEventListener('mousedown', put_stemp );
        }

        //[マーカー]が選択された時
        if( radioVal === "2" ){
            $( "#canvas" )[0].addEventListener('mousedown', marker_mousedown );
            $( "#canvas" )[0].addEventListener('mousemove', marker_mousemove );
            $( "#canvas" )[0].addEventListener('mouseup', marker_mouseup );
        }

       //[消しゴム]が選択された時
       if( radioVal === "3" ){
            $( "#canvas" )[0].addEventListener('mousedown', marker_mousedown );
            $( "#canvas" )[0].addEventListener('mousemove', eraser_mousemove );
            $( "#canvas" )[0].addEventListener('mouseup', marker_mouseup );
        }

    });

    //3つの数字→カラー数値を返す関数
    function hexFromRGB(r, g, b) {

         let hex = [ r.toString( 16 ) , g.toString( 16 ) , b.toString( 16 ) ];
         $.each( hex, function( nr, val ) {
             if ( val.length === 1 ) {
                 hex[ nr ] = "0" + val;
             } 
         });
         return hex.join( "" ).toUpperCase();
    
    }
    
    //カラースライダー3つの数値→カラー名、カラーサイクルの設定変更
    function refreshSwatch(){
    
        let red = $( "#red_colorbar" ).slider( "value" ),
        green = $( "#green_colorbar" ).slider( "value" ),
        blue = $( "#blue_colorbar" ).slider( "value" ),
    
        hex = hexFromRGB( red, green, blue );
    
        $( "#color_circle" ).css( "background-color", "#" + hex );　　　　　
        $( "#color_name" ).text( "#" + hex );
        $( "#color_name" ).css( "border", "solid 7px #" + hex );
    
    }
    
    //太さスライダー→サイクルの直径変更
    function refreshTextsize(){
    
       let Textsize =$( "#marker_size_sizebar" ).slider( "value" );
       let M = ( 80 - Textsize )/2;
       M = String(M) + "px";
       $( "#color_circle" ).css( "margin-top" , M ); 
       $( "#color_circle" ).css( "margin-left" , M );
       $( "#color_circle" ).width( Textsize +"px" );
       $( "#color_circle" ).height( Textsize +"px" );

    }
    
    $( "#red_colorbar,#green_colorbar,#blue_colorbar" ).slider({
    
        max:255, //最大値
        min: 0, //最小値
        value:0, //初期値
        step: 1, //幅
    
        slide: refreshSwatch,
        change: refreshSwatch
    
    });
    
    $( "#marker_size_sizebar" ).slider({
    
        max: 60, //最大値
        min: 0, //最小値
        value: 60, //初期値
        step: 1, //幅
                 
        create: refreshTextsize,
        slide: refreshTextsize,
        change: refreshTextsize
    
    });
    
    //文字スタンプ
    //textをcanvasに位置(x,y)に描写する
    function draw( canvas , text , x , y ){
    
        //変数canvasのコンテキストを定義
        var ctx = canvas.getContext('2d');
    
        //フォント情報を取得＆設定
        let size = $( "#text_size" ).slider( "value" );
        let font = String( size  )+"px 'ＭＳ ゴシック'";
        ctx.font = font;
        ctx.fillStyle = "gray";
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";
    
        //描写
        let text_style = $('option:selected').val();
        if( text_style === "1" ){
            ctx.fillText( text , x , y );
        }
        if( text_style === "2" ){
            ctx.strokeText( text , x , y );
        }
         
    }
    
    //canvas_stamp_sampleの「あ」を更新する関数
    function refresh_canvas_stamp_sample(){
    
        let canvas_sample = $('#canvas_stamp_sample').get(0);
        let canvas_sample_ctx = canvas_sample.getContext('2d');
        canvas_sample_ctx.fillStyle = "gray";
        let X = canvas_sample.width;
        let Y = canvas_sample.height;
        //まずキャンバスの「あ」を削除
        canvas_sample_ctx.clearRect( 0 , 0 , X , Y );
    
        //次に現在の設定の「あ」を描写
        let R = $( "#text_size" ).slider( "value" );
        draw( canvas_sample , "あ" , (X-R)/2 -2 , (Y+R)/2 - 12 );
    
    }
    
    $( "#text_size" ).slider({
    
        max:100, //最大値
        min: 0, //最小値
        value:100, //初期値
        step: 1, //幅
    
        //文字サイズのsliderが変更される度canvas_sampleを更新
        create: refresh_canvas_stamp_sample,
        slide: refresh_canvas_stamp_sample,
        change: refresh_canvas_stamp_sample
    });
    
    //セレクトが変更される度canvas_sampleを更新
    $("#option").change(function() {
     
        //ここに処理を記述する
        refresh_canvas_stamp_sample();
    
    });
    
    //消しゴム
    function refreshEraser(){
    
        var Textsize =$( "#eraser_size" ).slider( "value" );
        let M = ( 80 - Textsize )/2;
        M = String(M) + "px";
        $( "#eraser_circle" ).css( "margin-top" , M ); 
        $( "#eraser_circle" ).css( "margin-left" , M ); 
        $( "#eraser_circle" ).width( Textsize +"px" );
        $( "#eraser_circle" ).height( Textsize +"px" );
    }
    
    $( "#eraser_size" ).slider({
    
        max: 60, //最大値
        min: 0, //最小値
        value: 60, //初期値
        step: 1, //幅
    
        slide: refreshEraser,
        change: refreshEraser
    });
    
   var ctx = $( "#canvas" )[0].getContext('2d');
   //マウス位置情報（mousex, mousey）
   var mousex, mousey;
   //現在クリック状態の変数（trueはON、falseはOFF）
   var state = false;
    
   //文字スタンプ用関数群
   function put_stemp(e) {
    
        let canvas = $('#canvas').get(0);
    
        //クリックした位置(キャンバスの左角を原点とした位置)を取得する
        let x = e.offsetX;
        let y = e.offsetY;
    　　　　　　　　　　
        //テキストボックスからテキスト情報を取得
        let text =$("#id_textarea").val();
    
        //文字を改行ごとに分けてリストを作る
        let text_list = text.split( "\n" );
    
        let size = $( "#text_size" ).slider( "value" );
    
        //for文で1行目→改行して2行目→…を続ける
        for( i=0 ; i<text_list.length ; i++ ){
            let kaigyou = y + size * i;  
            draw( canvas , text_list[i] , x , kaigyou )
        }
    
    }
    
    //マーカー用関数群
    function marker_mousedown(e) {

        //クリックした位置を取得する
        mousex = e.offsetX;
        mousey = e.offsetY;
        //クリックしていたらONにする（stateをtrueにする）
        state = true; // クリック状態をON
        console.log( state);
        
    }
    
    function marker_mousemove(e){
        
        //クリックされてなかったら実行しない
        if(!state) return;
    
        //クリックされていたら以下を実行 
        ctx.lineWidth = ($( "#marker_size_sizebar" ).slider( "value" ));                  //線の太さ
        ctx.strokeStyle =  $("#color_circle").css( "background-color" );   //線のカラー
        ctx.lineCap = 'round';              　 //線の両端に丸みを付けてスムーズな描画にする
        ctx.beginPath();　　                   //パスをリセットする。いや、パスって何？要素とかアイテムみたいなこと？
        ctx.moveTo(mousex, mousey); 　　　     //パスの開始座標をクリックした点にする
        ctx.lineTo(e.offsetX, e.offsetY); 　   //書き始めの位置からマウスの位置まで線を引く
        ctx.stroke();　　　　　　　　　　　　  //現在のパス(＝ライン？)を輪郭表示する
    
        //直前のマウス座標を更新
        mousex = e.offsetX;
        mousey = e.offsetY;
    
    }
    
    function marker_mouseup(e){
        //クリックをやめるとクリック状態をOFFにする
        state = false;
        
    }
    
    //消しゴム関数群
    function eraser_mousemove(e){
        
        //クリックされてなかったら実行しない
        if(!state) return;
    
        //クリックされていたら以下を実行 
        ctx.lineWidth = ($( "#eraser_size" ).slider( "value" ));
        ctx.strokeStyle =  $("#canvas").css( "background-color" );   //線のカラー
        ctx.lineCap = 'round';              　 //線の両端に丸みを付けてスムーズな描画にする
        ctx.beginPath();　　                   //パスをリセットする。いや、パスって何？要素とかアイテムみたいなこと？
        ctx.moveTo(mousex, mousey); 　　　     //パスの開始座標をクリックした点にする
        ctx.lineTo(e.offsetX, e.offsetY); 　   //書き始めの位置からマウスの位置まで線を引く
        ctx.stroke();　　　　　　　　　　　　  //現在のパス(＝ライン？)を輪郭表示する
    
        //直前のマウス座標を更新
        mousex = e.offsetX;
        mousey = e.offsetY;
     
    }
    
  

});
