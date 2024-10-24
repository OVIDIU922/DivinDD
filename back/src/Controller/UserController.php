<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class UserController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private SluggerInterface $slugger;

    public function __construct(EntityManagerInterface $entityManager, SluggerInterface $slugger)
    {
        $this->entityManager = $entityManager;
        $this->slugger = $slugger;
    }

    #[Route('/api/user/profile', name: 'api_user_profile', methods: ['GET'])]
    public function getUserProfile(NormalizerInterface $normalizer): JsonResponse
    {
        $user = $this->getUser();
        if (!$user || !$user instanceof User) {
            return $this->json(['error' => 'Utilisateur non connecté ou non trouvé'], 401);
        }

        $userData = $normalizer->normalize($user, null, ['groups' => 'user:profile']);
        return new JsonResponse($userData);
    }

    #[Route('/api/users/{id}', name: 'update_user', methods: ['POST'])]
    public function updateUser(Request $request, User $user, ValidatorInterface $validator): JsonResponse
    {
        $data = $request->toArray(); // Use toArray() for JSON input

        // Validate data
        $constraints = new Assert\Collection([
            'name' => new Assert\Length(['min' => 3]),
            'phone' => new Assert\Regex('/^\d{10}$/'),
            'address' => new Assert\NotBlank(),
            'birthdate' => new Assert\Date(),
            'gender' => new Assert\Choice(['choices' => ['male', 'female', 'other']]),
        ]);
        $violations = $validator->validate($data, $constraints);

        if (count($violations) > 0) {
            return $this->json(['error' => 'Données invalides', 'details' => (string)$violations], 400);
        }

        // Handle file upload
        $profilePicture = $request->files->get('profilePicture');
        if ($profilePicture) {
            $newFilename = $this->uploadProfilePicture($profilePicture);
            if ($newFilename === null) {
                throw new BadRequestHttpException("Erreur lors de l'upload de l'image.");
            }
            $user->setProfilePicture($newFilename);
        }

        // Update user data
        $user->setName($data['name']);
        $user->setPhone($data['phone']);
        $user->setAddress($data['address']);
        $user->setBirthdate(new \DateTime($data['birthdate']));
        $user->setGender($data['gender']);

        // Persist changes
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Profil mis à jour avec succès'], 200);
    }

    private function uploadProfilePicture($file): ?string
    {
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $newFilename = $this->slugger->slug($originalFilename) . '-' . uniqid() . '.' . $file->guessExtension();

        try {
            $file->move($this->getParameter('profile_pictures_directory'), $newFilename);
            return $newFilename;
        } catch (FileException $e) {
            return null; // Handle error accordingly
        }
    }

    #[Route('/api/user/change-password', name: 'change_password', methods: ['POST'])]
    public function changePassword(Request $request, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $oldPassword = $data['oldPassword'] ?? '';
        $newPassword = $data['newPassword'] ?? '';

        if (!$passwordHasher->isPasswordValid($user, $oldPassword)) {
            return new JsonResponse(['error' => 'Identifiants incorrects'], 400);
        }

        $encodedPassword = $passwordHasher->hashPassword($user, $newPassword);
        $user->setPassword($encodedPassword);
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Mot de passe changé avec succès']);
    }

    #[Route('/api/user/delete-account', name: 'delete_account', methods: ['DELETE'])]
    public function deleteAccount(): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        $this->entityManager->remove($user);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Compte supprimé avec succès']);
    }
}








/*declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;


class UserController extends AbstractController
{

    private $entityManager;
    private $slugger;

    public function __construct(EntityManagerInterface $entityManager, SluggerInterface $slugger)
    {
        $this->entityManager = $entityManager;
        $this->slugger = $slugger;
    }

    // Endpoint pour récupérer le profil de l'utilisateur connecté 1
    #[Route('/api/user/profile', name: 'api_user_profile', methods: ['GET'])]
    public function getUserProfile(): JsonResponse
    {
        $user = $this->getUser();

            if (!$user || !$user instanceof User) {
                return $this->json(['error' => 'Utilisateur non connecté ou non trouvé'], 401);
            }

        // Préparer les données utilisateur
        $orders = [];
        foreach ($user->getOrders() as $order) {
            $products = $order->getProducts() ? $order->getProducts()->toArray() : [];
            $orders[] = [
                'id' => $order->getId(),
                'date' => $order->getOrderDate() ? $order->getOrderDate()->format('Y-m-d') : null,
                'status' => $order->getStatus(),
                'total' => $order->getTotalAmount(),
                'products' => array_map(function ($product) {
                    return [
                        'id' => $product->getId(),
                        'name' => $product->getName(),
                        'description' => $product->getDescription(),
                        'image' => $product->getImageUrl(),
                        'price' => $product->getPrice(),
                    ];
                }, $products),
            ];
        }

        $favorites = [];
        foreach ($user->getFavorites() as $favorite) {
            $favorites[] = [
                'id' => $favorite->getId(),
                'name' => $favorite->getName(),
                'description' => $favorite->getDescription(),
                'image' => $favorite->getImage(),
                'price' => $favorite->getPrice(),
            ];
        }


        // Récupérer les avantages de l'utilisateur
        $advantages = [];
        if ($user->getAdvantages()) {
            foreach ($user->getAdvantages() as $advantage) {
                $advantages[] = $advantage; // Ajoute directement l'avantage si c'est une chaîne de caractères
            }
        }

        // Récupérer les notifications de l'utilisateur
        $notifications = [];
        foreach ($user->getNotifications() as $notification) {
            $notifications[] = [
                'id' => $notification->getId(),
                'message' => $notification->getMessage(),
                'date' => $notification->getCreatAt() ? $notification->getCreatAt()->format('Y-m-d H:i:s') : null,
            ];
        }
        
        // Sérialiser les autres données
        $userData = [
            'id' => $user->getId(),
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'phone' => $user->getPhone(),
            'address' => $user->getAddress(),
            'birthdate' => $user->getBirthdate() ? $user->getBirthdate()->format('Y-m-d') : null,
            'gender' => $user->getGender(),
            'profilePicture' => $user->getProfilePicture(),
            'orders' => $orders,
            'favorites' => $user->getFavorites(), // Si déjà bien sérialisé dans l'entité
            'loyaltyPoints' => $user->getLoyaltyPoints(),
            'advantages' => $user->getAdvantages(),
            'notifications' => array_map(function ($notification) {
                return [
                    'id' => $notification->getId(),
                    'message' => $notification->getMessage(),
                    'date' => $notification->getCreatedAt() ? $notification->getCreatedAt()->format('Y-m-d H:i:s') : null,
                ];
            }, $user->getNotifications()->toArray())
        ];

    }

    // Endpoint pour complété votre Profile les informations utilisateur 
    #[Route('/api/users/{id}', name: 'update_user', methods: ['PUT'])]
    public function updateUser(Request $request, User $user): JsonResponse
    {

           // Récupérer les données du formulaire
        $name = $request->request->get('name');
        $phone = $request->request->get('phone');
        $address = $request->request->get('address');
        $birthdate = $request->request->get('birthdate');
        $gender = $request->request->get('gender');

        // Gérer le fichier de la photo de profil
        $profilePicture = $request->files->get('profilePicture');
        if ($profilePicture) {
            $originalFilename = pathinfo($profilePicture->getClientOriginalName(), PATHINFO_FILENAME);
            // Nécessaire pour sécuriser le nom du fichier (e.g. supprimer les caractères spéciaux)
            $safeFilename = $this->slugger->slug($originalFilename);
            $newFilename = $safeFilename.'-'.uniqid().'.'.$profilePicture->guessExtension();

            // Déplacement du fichier vers le répertoire configuré
            try {
                $profilePicture->move(
                    $this->getParameter('profile_pictures_directory'),
                    $newFilename
                );
                $user->setProfilePicture($newFilename);
            } catch (FileException $e) {
                return new JsonResponse(['error' => 'Erreur lors de l\'upload de l\'image'], 500);
            }
        }

        // Mettre à jour les autres informations utilisateur
        $user->setName($name);
        $user->setPhone($phone);
        $user->setAddress($address);
        $user->setBirthdate(new \DateTime($birthdate));
        $user->setGender($gender);

        // Sauvegarder les changements dans la base de données
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Votre profile il est compléter avec succès']);
    }
    
    

    // Endpoint pour changer le mot de passe de l'utilisateur 3
    #[Route('/api/user/change-password', name: 'change_password', methods: ['POST'])]
    public function changePassword(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $oldPassword = $data['oldPassword'] ?? '';
        $newPassword = $data['newPassword'] ?? '';

        if (!$passwordHasher->isPasswordValid($user, $oldPassword)) {
            return new JsonResponse(['error' => 'Ancien mot de passe incorrect'], 400);
        }

        $encodedPassword = $passwordHasher->hashPassword($user, $newPassword);
        $user->setPassword($encodedPassword);

        $em->persist($user);
        $em->flush();

        return new JsonResponse(['message' => 'Mot de passe changé avec succès']);
    }

    // Endpoint pour supprimer le compte utilisateur 2
    #[Route('/api/user/delete-account', name: 'delete_account', methods: ['DELETE'])]
    public function deleteAccount(EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        $em->remove($user);
        $em->flush();

        return new JsonResponse(['message' => 'Compte supprimé avec succès']);
    }
}*/
