<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\OrderRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OrderRepository::class)]
#[ORM\Table(name: '`order`')] // Échappe le nom de la table
class Order
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'orders')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null; // Renommé pour clarifier

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(length: 255)]
    private ?string $status = null; // Corrigé

    #[ORM\OneToMany(targetEntity: OrderList::class, mappedBy: 'order')]
    private Collection $orderLists;

    #[ORM\Column]
    private ?float $totalAmount = null;

    public function __construct()
    {
        $this->orderLists = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User // Renommé pour clarifier
    {
        return $this->user;
    }

    public function setUser(?User $user): static // Renommé pour clarifier
    {
        $this->user = $user;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getStatus(): ?string // Corrigé
    {
        return $this->status; // Corrigé
    }

    public function setStatus(string $status): static // Corrigé
    {
        $this->status = $status;

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
            $orderList->setOrder($this); // Modifié pour correspondre à la méthode
        }

        return $this;
    }

    public function removeOrderList(OrderList $orderList): static
    {
        if ($this->orderLists->removeElement($orderList)) {
            // set the owning side to null (unless already changed)
            if ($orderList->getOrder() === $this) { // Modifié pour correspondre à la méthode
                $orderList->setOrder(null);
            }
        }

        return $this;
    }

    public function getTotalAmount(): ?float
    {
        return $this->totalAmount;
    }

    public function setTotalAmount(float $totalAmount): static
    {
        $this->totalAmount = $totalAmount;

        return $this;
    }
}





/*declare(strict_types=1);

namespace App\Entity;

use App\Repository\OrderRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OrderRepository::class)]
#[ORM\Table(name: '`order`')] // Échappe le nom de la table
class Order
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'orders')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null; // Renommé pour clarifier

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(length: 255)]
    private ?string $status = null; // Corrigé

    /**
     * @var Collection<int, OrderList>
     */
    /*#[ORM\OneToMany(targetEntity: OrderList::class, mappedBy: 'order')] // Modifié pour corriger le mappage
    private Collection $orderLists;

    #[ORM\Column]
    private ?float $totalAmount = null;

    public function __construct()
    {
        $this->orderLists = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User // Renommé pour clarifier
    {
        return $this->user;
    }

    public function setUser(?User $user): static // Renommé pour clarifier
    {
        $this->user = $user;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getStatus(): ?string // Corrigé
    {
        return $this->status; // Corrigé
    }

    public function setStatus(string $status): static // Corrigé
    {
        $this->status = $status;

        return $this;
    }

    /**
     * @return Collection<int, OrderList>
     */
    /*public function getOrderLists(): Collection
    {
        return $this->orderLists;
    }

    public function addOrderList(OrderList $orderList): static
    {
        if (!$this->orderLists->contains($orderList)) {
            $this->orderLists->add($orderList);
            $orderList->setOrder($this); // Modifié pour correspondre à la méthode
        }

        return $this;
    }

    public function removeOrderList(OrderList $orderList): static
    {
        if ($this->orderLists->removeElement($orderList)) {
            // set the owning side to null (unless already changed)
            if ($orderList->getOrder() === $this) { // Modifié pour correspondre à la méthode
                $orderList->setOrder(null);
            }
        }

        return $this;
    }

    public function getTotalAmount(): ?float
    {
        return $this->totalAmount;
    }

    public function setTotalAmount(float $totalAmount): static
    {
        $this->totalAmount = $totalAmount;

        return $this;
    }
}*/
