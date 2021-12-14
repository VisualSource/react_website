<?php
    class Response {
        private static function root($code,$res){
            $response['status_code_header'] = $code;
            $response['body'] = $res;
            return $response;
        }
        public static function badRequestResponse() {
            return self::root('HTTP/1.1 400 Bad Request','{ "type":"error","code":400,"message":"Bad Request"}');
        }
        public static function notFoundResponse() {
            return self::root('HTTP/1.1 404 Not Found','{ "type":"error","code":404,"message":"Not Found"}');
        }
        public static function okResponse($body) {
            return self::root('HTTP/1.1 200 Ok',$body);
        }
        public static function createdResponse() {
            return $self::root('HTTP/1.1 201 Created','{ "type":"success","code":201,"message":"Created"}');
        }
        public static function forbiddenResponse() {
            return self::root('403 Forbidden','{ "type":"success","code":403,"message":"Forbidden"}');
        }
        public static function tooManyRequestResponse() {
            return self::root('429 Too Many Requests','{ "type":"success","code":429,"message":"Too Many Requests"}');
        }
        public static function acceptedResponse() {
            return self::root('HTTP/1.1 202 Accepted','{ "type":"success","code":202,"message":"Accepted"}');
        }
        public static function unauthorizedResponse() {
            return self::root('HTTP/1.1 401 Unauthorized','{ "type":"error","code":401,"message":"Unauthorized"}');
        }
        public static function notImplementedResponse() {
            return self::root('HTTP/1.1 501 Not Implemented','{ "type":"error","code":501,"message":"Not Implemented"}');
        }
        public static function internalServerErrorResponse() {
            return self::root('HTTP/1.1 500 Internal Server Error','{ "type":"error","code":500,"message":"Internal Server Error"}');
        }
    }
?>