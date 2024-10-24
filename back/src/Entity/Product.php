<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $description = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)] // Ajuster scale si nécessaire
    private ?string $price = null;

    #[ORM\Column(length: 255)]
    private ?string $image = null;

    #[ORM\ManyToOne(targetEntity: Category::class, inversedBy: 'products')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Category $category = null; // Vérifier ce type

    #[ORM\OneToMany(targetEntity: OrderList::class, mappedBy: 'product')]
    private Collection $orderLists;

    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'favorites')]
    private Collection $users;

    public function __construct()
    {
        $this->orderLists = new ArrayCollection();
        $this->users = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(string $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(string $image): static
    {
        $this->image = $image;

        return $this;
    }

    public function getCategory(): ?Category // Corrigé le type ici
    {
        return $this->category; // Vérifié
    }

    public function setCategory(?Category $category): static // Corrigé le type ici
    {
        $this->category = $category;

        return $this;
    }

    public function getOrderLists(): Collection
    {
        return $this->orderLists;
    }

    public function addOrderList(OrderList $orderList): static
    {
        if (!$this->orderLists->contains($orderList)) {
            $this->orderLists->add($orderList);
            $orderList->setProduct($this); // Vérifié ici
        }

        return $this;
    }

    public function removeOrderList(OrderList $orderList): static
    {
        if ($this->orderLists->removeElement($orderList)) {
            if ($orderList->getProduct() === $this) { // Vérifié ici
                $orderList->setProduct(null);
            }
        }

        return $this;
    }

    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): static
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
            $user->addFavorite($this); // Vérifié ici
        }

        return $this;
    }

    public function removeUser(User $user): static
    {
        if ($this->users->removeElement($user)) {
            $user->removeFavorite($this); // Vérifié ici
        }

        return $this;
    }
}


