<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\OrderListRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OrderListRepository::class)]
class OrderList
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'orderLists')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Order $order = null; // Renommé pour clarifier

    #[ORM\ManyToOne(inversedBy: 'orderLists')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Product $product = null; // Renommé pour clarifier

    #[ORM\Column]
    private ?int $quantity = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)] // Modification de l'échelle pour permettre les valeurs décimales
    private ?string $unitPrice = null; // Modifié en float pour les calculs


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOrder(): ?Order // Renommé pour clarifier
    {
        return $this->order;
    }

    public function setOrder(?Order $order): static
    {
        $this->order = $order;

        return $this;
    }

    public function getProduct(): ?Product // Renommé pour clarifier
    {
        return $this->product;
    }

    public function setProduct(?Product $product): static
    {
        $this->product = $product;

        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): static
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getUnitPrice(): ?string // Modifié en float
    {
        return $this->unitPrice;
    }

    public function setUnitPrice(string $unitPrice): static // Modifié en float
    {
        $this->unitPrice = $unitPrice;

        return $this;
    }
}



