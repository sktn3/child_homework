
# 小学校低学年用の算数ドリル

公開
https://sktn3.github.io/child_homework/sansu1.html

- UIの注意事項
  - 数字は下桁から入ります
    - 例えば、21を入力する場合、１→２の順番に入力してください
    - 暗算する際に、１桁目から考えてもらうためです 

- HTML+JSのみで稼働
	- 以下をAWS S3等に置きブラウザで開くだけで使えます
		- sansu1.html
		- sansu1.js
		![画面キャプチャ](https://github.com/sktn3/myPhoto/blob/master/sansu1.png "画面キャプチャ")
	- PCのローカルに保存したファイルをアクセスしても動きません。
		- 趣味でlocalStorageを利用しているため。
	- es5しか使えない（自宅の古いiPad）ブラウザ用にBabelさんに頑張ってもらう
		- sansu1.es5.html
		- sansu1.es5.js
		- （core-jsのメンテナンスどうなるだろう。。。）
- 子供のためにという建前で、遊びで作りました。

