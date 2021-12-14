<?php

namespace VisualSource\Exception;

use Exception;
use \League\Route\Http;

class InternalServerErrorException extends Http\Exception
{
    public function __construct(string $message = 'Internal Server Error', ?Exception $previous = null, int $code = 0)
    {
        parent::__construct(500, $message, $previous, [], $code);
    }
}

?>