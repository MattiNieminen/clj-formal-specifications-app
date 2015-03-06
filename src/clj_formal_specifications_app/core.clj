(ns clj-formal-specifications-app.core
  (:require [clj-formal-specifications-app.spec :as spec]
            [clj-formal-specifications-app.examples :as examples]
            [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.middleware.defaults :refer :all]
            [ring.middleware.json :refer :all]
            [ring.util.response :as resp]
            [org.httpkit.server :refer [run-server]]))

(defn example-listing
  []
  {:body (map examples/example
              (examples/files-as-strings examples/example-dir))})

(defn example-file
  [filename]
  {:body {:contents (slurp (str examples/example-dir "/" filename))}})

(defn compose
  [spec]
  (let [ns (spec/get-ns-name spec)]
    {:body (do (remove-ns (symbol ns)) (load-string spec) ns)}))

(defn execute-with-ns
  [ns command]
  {:body (str (binding [*ns* (find-ns (symbol ns))] (load-string command)))})

(defn ns-data
  [ns]
  {:body (spec/ns-spec ns)})

(defroutes api-routes
  (GET "/api/examples" [] (example-listing))
  (GET "/api/examples/:filename" [filename] (example-file filename))
  (POST "/api/compose" [specification] (compose specification))
  (POST "/api/execute" [ns command] (execute-with-ns ns command))
  (GET "/api/namespace/:ns" [ns] (ns-data ns)))

(defn index
  [req]
  (resp/content-type
    (resp/resource-response "index.html" {:root "public"})
    "text/html"))

(defroutes site-routes
  (GET "/" [] index)
  (route/resources "/")
  (route/not-found "Not found!"))

(def site (wrap-defaults site-routes site-defaults))

(def api
  (-> api-routes
      (wrap-json-response)
      (wrap-defaults api-defaults)))

(def app (routes api site))

(defn -main
  []
  (run-server app {:port 5000}))
