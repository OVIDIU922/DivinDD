<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;
use App\Event\UserRegisteredEvent;



class RegistrationController extends AbstractController
{


    #[Route('/api/register', name: 'api_register', methods: ['GET', 'POST'])]
public function register(
    Request $request,
    UserPasswordHasherInterface $passwordHasher,
    EntityManagerInterface $em,
    EventDispatcherInterface $eventDispatcher
): JsonResponse {
    try {
        $data = json_decode($request->getContent(), true);

        $name = $data['name'] ?? null;
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$name || !$email || !$password) {
            return new JsonResponse(['error' => 'Nom, email et mot de passe sont requis'], 400);
        }

        $existingUser = $em->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existingUser) {
            return new JsonResponse(['error' => 'Cet email est déjà utilisé'], 409);
        }

        $user = new User();
        $user->setName($name);
        $user->setEmail($email);
        $user->setPassword(
            $passwordHasher->hashPassword($user, $password)
        );

        $em->persist($user);
        $em->flush();

        // Déclencher l'événement d'inscription de l'utilisateur
        $eventDispatcher->dispatch(new UserRegisteredEvent($user), UserRegisteredEvent::NAME);

        return new JsonResponse(['message' => 'Inscription réussie'], 201);

    } catch (\Exception $e) {
        return new JsonResponse(['error' => $e->getMessage()], 500);
    }
}
}

