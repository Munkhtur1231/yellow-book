"use client";

import { useState, useEffect } from "react";
import {
  Layout,
  Input,
  Button,
  Select,
  Card,
  Row,
  Col,
  Spin,
  message,
} from "antd";
import {
  SearchOutlined,
  ShopOutlined,
  CoffeeOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  EditOutlined,
  MedicineBoxOutlined,
  LaptopOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { placesApi } from "@/lib/api";
import type { Place } from "@/types";

const { Content } = Layout;
const { Option } = Select;

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState({
    restaurant: 0,
    hotel: 0,
    shop: 0,
    service: 0,
  });

  // Fetch recent places and category counts on mount
  useEffect(() => {
    fetchPlaces();
    fetchCategoryCounts();
  }, []);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const result = await placesApi.search({ limit: 6 });
      if (result.success && result.data) {
        setPlaces(result.data);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Өгөгдөл татахад алдаа гарлаа";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryCounts = async () => {
    try {
      const types: Array<"restaurant" | "hotel" | "shop" | "service"> = [
        "restaurant",
        "hotel",
        "shop",
        "service",
      ];
      const counts = await Promise.all(
        types.map(async (type) => {
          const result = await placesApi.search({ type, limit: 1 });
          return {
            type,
            count: result.pagination?.total || 0,
          };
        })
      );

      const countsObj: Record<
        "restaurant" | "hotel" | "shop" | "service",
        number
      > = {
        restaurant: 0,
        hotel: 0,
        shop: 0,
        service: 0,
      };
      counts.forEach(({ type, count }) => {
        countsObj[type] = count;
      });
      setCategoryCounts(countsObj);
    } catch (error) {
      console.error("Error fetching category counts:", error);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    if (searchType !== "all") params.append("type", searchType);
    router.push(`/search?${params.toString()}`);
  };

  const handleCategoryClick = (type: string) => {
    router.push(`/search?type=${type}`);
  };
  const categories = [
    {
      icon: <ShopOutlined />,
      title: "Ресторан",
      count: `${categoryCounts.restaurant} байгууллага`,
      type: "restaurant",
    },
    {
      icon: <CoffeeOutlined />,
      title: "Зочид буудал",
      count: `${categoryCounts.hotel} байгууллага`,
      type: "hotel",
    },
    {
      icon: <ShopOutlined />,
      title: "Дэлгүүр",
      count: `${categoryCounts.shop} байгууллага`,
      type: "shop",
    },
    {
      icon: <EditOutlined />,
      title: "Үйчилгээ",
      count: `${categoryCounts.service} байгууллага`,
      type: "service",
    },
  ];

  return (
    <Layout>
      <Header />

      <Content>
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#f5a623] to-[#f7b731] py-20 px-5 text-center">
          <h1 className="text-white text-5xl font-bold mb-4">Шар ном</h1>
          <p className="text-white text-lg mb-10">
            Бизнес үйлчилгээний үйл ажиллагааг хялбарчлах систем
          </p>

          <div className="max-w-[700px] mx-auto bg-white rounded-lg p-2 flex gap-2">
            <Input
              placeholder="Бизнес үйлчилгээн нэр хайх..."
              size="large"
              className="flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onPressEnter={handleSearch}
            />
            <Select
              defaultValue="all"
              size="large"
              className="w-[180px]"
              value={searchType}
              onChange={(value) => setSearchType(value)}
            >
              <Option value="all">Бүх ангилал</Option>
              <Option value="restaurant">Ресторан</Option>
              <Option value="hotel">Зочид буудал</Option>
              <Option value="shop">Дэлгүүр</Option>
              <Option value="service">Үйлчилгээ</Option>
            </Select>
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              className="bg-[#faad14] border-[#faad14] hover:bg-[#d89614] hover:border-[#d89614]"
              onClick={handleSearch}
            >
              Хайх
            </Button>
          </div>
        </div>

        {/* Categories Section */}
        <div className="py-[60px] px-[50px] bg-gray-100">
          <h2 className="text-center text-[32px] mb-10">Ангиллууд</h2>
          <Row gutter={[24, 24]} justify="center">
            {categories.map((cat, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card
                  hoverable
                  className="text-center rounded-lg cursor-pointer"
                  onClick={() => handleCategoryClick(cat.type)}
                >
                  <div className="text-5xl mb-4 text-[#faad14]">{cat.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{cat.title}</h3>
                  <p className="text-gray-400 m-0">{cat.count}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Listings Section */}
        <div className="py-[60px] px-[50px]">
          <h2 className="text-center text-[32px] mb-10">
            Сүүлд нэмэгдсэн газрууд
          </h2>
          {loading ? (
            <div className="text-center py-10">
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {places.map((place, index) => (
                <Col xs={24} sm={12} md={8} key={place.id}>
                  <Link
                    href={`/details/${place.id}`}
                    className="no-underline text-inherit"
                  >
                    <Card
                      hoverable
                      cover={
                        <div
                          className="h-[200px] bg-cover bg-center flex items-center justify-center text-white text-6xl"
                          style={{
                            background:
                              place.images && place.images.length > 0
                                ? `url(${place.images[0]}) center/cover`
                                : `linear-gradient(135deg, ${
                                    index % 3 === 0
                                      ? "#8b4513"
                                      : index % 3 === 1
                                        ? "#dcdcdc"
                                        : "#4169e1"
                                  } 0%, ${
                                    index % 3 === 0
                                      ? "#a0522d"
                                      : index % 3 === 1
                                        ? "#f0f0f0"
                                        : "#6495ed"
                                  } 100%)`,
                          }}
                        >
                          {(!place.images || place.images.length === 0) &&
                            (index % 3 === 0 ? (
                              <ShopOutlined />
                            ) : index % 3 === 1 ? (
                              <MedicineBoxOutlined />
                            ) : (
                              <LaptopOutlined />
                            ))}
                        </div>
                      }
                      className="rounded-lg overflow-hidden"
                    >
                      <Card.Meta
                        title={place.name}
                        description={
                          <div>
                            <p className="mb-2">{place.description}</p>
                            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                              <EnvironmentOutlined /> {place.address}
                            </p>
                            <p className="text-xs text-gray-400 m-0 flex items-center gap-1">
                              <PhoneOutlined /> {place.phone}
                            </p>
                          </div>
                        }
                      />
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Content>
    </Layout>
  );
}
