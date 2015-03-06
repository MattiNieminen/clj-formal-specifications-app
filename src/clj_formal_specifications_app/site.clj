(ns clj-formal-specifications-app.site
  (:require [ring.util.response :as resp]))

(defn index
  [req]
  (resp/content-type
    (resp/resource-response "index.html" {:root "public"})
    "text/html"))
