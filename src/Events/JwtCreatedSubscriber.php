<?php

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber
{
    public function updateJwtData(JwtCreatedEvent $event)
    {
        // récup utilisateur
        $user = $event->getUser();
        // enrichir les datas pour qu'elles contiennent les données
        $data = $event->getData();
        $data['firstName'] = $user->getFirstName();
        $data['lastName'] = $user->getLastName();
    }
}
