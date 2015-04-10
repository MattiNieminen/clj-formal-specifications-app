(defproject clj-formal-specifications-app "0.1.0-SNAPSHOT"
  :description "A browser-based application for
  clj-formal-specifications."
  :url "https://github.com/MattiNieminen/clj-formal-specifications-app"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/tools.logging "0.3.1"]
                 [compojure "1.3.2"]
                 [ring/ring-defaults "0.1.4"]
                 [ring/ring-json "0.3.1"]
                 [ring/ring-devel "1.3.2"]
                 [http-kit "2.1.19"]
                 [clj-formal-specifications "1.2.0"]]
  :main ^:skip-aot clj-formal-specifications-app.server
  :target-path "target/%s"
  :profiles {:uberjar {:aot :all}})
