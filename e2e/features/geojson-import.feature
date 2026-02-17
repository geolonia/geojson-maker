# language: ja

機能: GeoJSONインポート
  ユーザーがGeoJSONファイルをインポートしてフィーチャを追加・置換できる

  背景:
    前提 アプリケーションが表示されている

  シナリオ: GeoJSONファイルをマージインポートする
    もし 地図の中央をクリックする
    ならば GeoJSONに 1 件のフィーチャが含まれる
    もし GeoJSONファイルをマージインポートする:
      """
      {"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[139.7,35.6]},"properties":{}}]}
      """
    ならば GeoJSONに 2 件のフィーチャが含まれる

  シナリオ: GeoJSONファイルを置換インポートする
    もし 地図の中央をクリックする
    ならば GeoJSONに 1 件のフィーチャが含まれる
    もし GeoJSONファイルを置換インポートする:
      """
      {"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[139.7,35.6]},"properties":{}}]}
      """
    ならば GeoJSONに 1 件のフィーチャが含まれる
