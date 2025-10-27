import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import { useParams } from "react-router-dom";
import { Star, Clock, MapPin, Shield, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Sharemenu from "@/components/ui/sharemenu";
import FavoriteButton from "@/components/FavoriteButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const reviews = [
	{
		id: "1",
		user: "Carlos Santos",
		avatar:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
		rating: 5,
		comment:
			"Trabalho excepcional! Ana entendeu perfeitamente o que eu precisava e entregou muito além das expectativas. Super recomendo!",
		date: "2025-01-10",
	},
	{
		id: "2",
		user: "Mariana Costa",
		avatar:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
		rating: 5,
		comment:
			"Profissional incrível! Entregou no prazo, com qualidade excepcional e sempre muito atenciosa. Já contratei várias vezes.",
		date: "2025-01-08",
	},
	{
		id: "3",
		user: "Pedro Oliveira",
		avatar:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
		rating: 4,
		comment:
			"Muito bom trabalho, ficou exatamente como imaginei. Comunicação excelente durante todo o processo.",
		date: "2025-01-05",
	},
];

const ServiceDetail = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { id } = useParams();
	const [currentImage, setCurrentImage] = useState(0);
	const [serviceData, setServiceData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const { toast: uiToast } = useToast();

	useEffect(() => {
		const fetchService = async () => {
			if (!id) return;

			try {
				setLoading(true);

				// Simplified query structure
				const { data: service, error: serviceError } = await supabase
					.from("services")
					.select(`
            *,
            user_id,
            service_images (
              url
            )
          `)
					.eq("id", id)
					.single();

				if (serviceError) {
					console.error("Erro ao carregar serviço:", serviceError);
					toast.error("Erro ao carregar serviço");
					return;
				}

				// Separate query for provider info
				const { data: provider } = await supabase
					.from("profiles")
					.select("*")
					.eq("id", service.user_id)
					.single();

				// Separate query for reviews
				const { data: reviews } = await supabase
					.from("reviews")
					.select(`
            *,
            profiles:user_id (
              full_name,
              avatar_url
            )
          `)
					.eq("service_id", id)
					.order("created_at", { ascending: false });

				console.log("Debug - Service:", service);
				console.log("Debug - Provider:", provider);
				console.log("Debug - Reviews:", reviews);
				console.log("Debug - Images:", service.service_images);

				// Format service data
				const formattedService = {
					id: service.id,
					title: service.title,
					description: service.description,
					fullDescription: service.description,
					category: service.category,
					price: service.price,
					deliveryTime: `${service.delivery_days || 7} dias`,
					rating: service.average_rating || 5.0,
					totalOrders: service.total_orders || 0,
					reviews: reviews || [],
					images:
						service.service_images?.map((img: any) => img.url) || [
							"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
						],
					features: service.features || [
						"Revisões ilimitadas",
						"Arquivos em alta resolução",
						"Suporte pós-entrega",
						"Garantia de satisfação",
					],
					provider: {
						id: provider?.id,
						name: provider?.full_name || "Usuário",
						avatar: provider?.avatar_url,
						location: provider?.location || "Brasil",
						memberSince:
							provider?.created_at
								? new Date(provider.created_at).getFullYear().toString()
								: new Date().getFullYear().toString(),
						rating: 5.0,
						totalReviews: reviews?.length || 0,
						responseTime: "2 horas",
						languages: ["Português"],
					},
				};

				setServiceData(formattedService);
			} catch (error) {
				console.error("Erro inesperado:", error);
				toast.error("Erro ao carregar serviço");
			} finally {
				setLoading(false);
			}
		};

		fetchService();
	}, [id]);

	const handleOrder = async () => {
		if (!user) {
			toast.error("Você precisa estar logado para fazer um pedido");
			navigate("/login");
			return;
		}

		try {
			setLoading(true);
			
			// Criar ordem no banco
			const { data: order, error: orderError } = await supabase
				.from("orders")
				.insert({
					service_id: serviceData.id,
					user_id: user.id,
					provider_id: serviceData.provider.id,
					status: "pending",
					amount: serviceData.price,
				})
				.select()
				.single();

			if (orderError) throw orderError;

			// Redirecionar para a página de processamento do pagamento
			navigate(`/payment-process/${order.id}`);

		} catch (error) {
			console.error("Erro ao criar pedido:", error);
			toast.error("Erro ao criar pedido");
		} finally {
			setLoading(false);
		}
	};

	const handleContact = () => {
		uiToast({
			title: "Mensagem enviada",
			description: `Mensagem enviada para ${
				serviceData?.provider.name || "o prestador"
			}!`,
		});
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-background">
				<Header />
				<main className="container mx-auto px-4 py-8">
					<div className="text-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
						<p className="mt-4 text-muted-foreground">
							Carregando serviço...
						</p>
					</div>
				</main>
			</div>
		);
	}

	if (!serviceData) {
		return (
			<div className="min-h-screen bg-background">
				<Header />
				<main className="container mx-auto px-4 py-8">
					<div className="text-center py-12">
						<p className="text-muted-foreground">Serviço não encontrado.</p>
						<Link to="/services">
							<Button className="mt-4">Voltar para serviços</Button>
						</Link>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<main className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Images */}
						<Card className="overflow-hidden">
							<div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10">
								<img
									src={serviceData.images[currentImage]}
									alt={serviceData.title}
									className="w-full h-full object-cover"
									onError={(e) => {
										const img = e.target as HTMLImageElement;
										img.src =
											"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop";
									}}
								/>
							</div>
							<div className="flex gap-2 p-4">
								{serviceData.images.map((image: string, index: number) => (
									<button
										key={index}
										onClick={() => setCurrentImage(index)}
										className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
											currentImage === index
												? "border-primary"
												: "border-transparent"
										}`}
									>
										<img
											src={image}
											alt={`Preview ${index + 1}`}
											className="w-full h-full object-cover"
											onError={(e) => {
												const img = e.target as HTMLImageElement;
												img.src =
													"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop";
											}}
										/>
									</button>
								))}
							</div>
						</Card>

						{/* Service Info */}
						<Card>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="space-y-2">
										<Badge variant="secondary">
											{serviceData.category}
										</Badge>
										<CardTitle className="text-2xl">
											{serviceData.title}
										</CardTitle>
										<div className="flex items-center space-x-4 text-sm text-muted-foreground">
											<div className="flex items-center">
												<Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
												{serviceData.rating.toFixed(1)} (
												{serviceData.reviews} avaliações)
											</div>
											<div>|</div>
											<div>{serviceData.totalOrders} pedidos</div>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<FavoriteButton
											serviceId={serviceData.id}
											size="sm"
											variant="outline"
										/>
										<Sharemenu
											service={{
												id: serviceData.id,
												title: serviceData.title,
											}}
										/>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<p className="text-muted-foreground">
										{serviceData.description}
									</p>

									<div className="prose max-w-none">
										<div className="whitespace-pre-line text-sm">
											{serviceData.fullDescription}
										</div>
									</div>

									<div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
										{serviceData.features.map(
											(feature: string, index: number) => (
												<div
													key={index}
													className="flex items-center space-x-2"
												>
													<Shield className="h-4 w-4 text-success" />
													<span className="text-sm">
														{feature}
													</span>
												</div>
											)
										)}
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Reviews */}
						<Card>
							<CardHeader>
								<CardTitle>
									Avaliações ({serviceData.reviews})
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{reviews.map((review) => (
										<div key={review.id} className="flex space-x-4">
											<Avatar>
												<AvatarImage src={review.avatar} />
												<AvatarFallback>
													{review.user[0]}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 space-y-2">
												<div className="flex items-center justify-between">
													<h4 className="font-semibold">{review.user}</h4>
													<div className="flex items-center text-sm text-muted-foreground">
														<div className="flex items-center mr-2">
															{Array.from({ length: review.rating }).map(
																(_, i) => (
																	<Star
																		key={i}
																		className="h-3 w-3 fill-yellow-400 text-yellow-400"
																	/>
																)
															)}
														</div>
														{new Date(review.date).toLocaleDateString()}
													</div>
												</div>
												<p className="text-sm text-muted-foreground">
													{review.comment}
												</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Order Card */}
						<Card className="sticky">
							<CardHeader>
								<div className="text-center">
									<div className="text-3xl font-bold text-primary mb-2">
										R$ {serviceData.price.toLocaleString()}
									</div>
									<div className="flex items-center justify-center text-sm text-muted-foreground">
										<Clock className="h-4 w-4 mr-1" />
										Entrega em {serviceData.deliveryTime}
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<Button
									className="w-full gradient-primary shadow-glow"
									size="lg"
									onClick={handleOrder}
									disabled={loading}
								>
									{loading ? "Processando..." : "Fazer Pedido"}
								</Button>

								<Link to="/chat">
									<Button
										variant="outline"
										className="w-full"
										onClick={handleContact}
									>
										Conversar
									</Button>
								</Link>
							</CardContent>
						</Card>

						{/* Provider Info */}
						<Card>
							<CardHeader>
								<CardTitle>Sobre o Prestador</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center space-x-3">
									<Avatar className="h-12 w-12">
										<AvatarImage src={serviceData.provider.avatar} />
										<AvatarFallback>
											{serviceData.provider.name[0]}
										</AvatarFallback>
									</Avatar>
									<div>
										<h4 className="font-semibold">
											{serviceData.provider.name}
										</h4>
										<div className="flex items-center text-sm text-muted-foreground">
											<MapPin className="h-3 w-3 mr-1" />
											{serviceData.provider.location}
										</div>
									</div>
								</div>

								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Membro desde:
										</span>
										<span>
											{serviceData.provider.memberSince}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Avaliação:
										</span>
										<div className="flex items-center">
											<Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
											{serviceData.provider.rating.toFixed(1)} (
											{serviceData.provider.totalReviews})
										</div>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Tempo de resposta:
										</span>
										<span>{serviceData.provider.responseTime}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Idiomas:
										</span>
										<span>
											{serviceData.provider.languages.join(", ")}
										</span>
									</div>
								</div>

								<Button variant="outline" className="w-full">
									Ver Perfil Completo
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
};

export default ServiceDetail;