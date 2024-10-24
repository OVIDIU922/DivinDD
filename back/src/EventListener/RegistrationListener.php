<?php

declare(strict_types=1);

namespace App\EventListener;


use App\Event\UserRegisteredEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;



#[AsEventListener(event: UserRegisteredEvent::NAME)]
class RegistrationListener
{
    private MailerInterface $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    public function __invoke(UserRegisteredEvent $event): void
    {
        $user = $event->getUser();

        $email = (new TemplatedEmail())
            ->from('divindd@example.com')
            ->to($user->getEmail())
            ->subject('Votre inscription sur DivinDD!')
            ->htmlTemplate('emails/register.html.twig')
            ->context([
                'user' => $user,
            ]);

        $this->mailer->send($email);
    }
}