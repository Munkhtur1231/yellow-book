"use client";

import { useState, useEffect, Suspense } from "react";
import { Layout, Input, Button, Select, Card, Row, Col, message } from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { placesApi } from "@/lib/api";
import type { Place } from "@/types";

const { Content } = Layout;
const { Option } = Select;

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get current query params
  const currentQuery = searchParams.get("q") || "";
  const currentType = searchParams.get("type") || "all";

  // Form state (separate from URL params)
  const [searchQuery, setSearchQuery] = useState(currentQuery);
  const [searchType, setSearchType] = useState(currentType);
  const [places, setPlaces] = useState<Place[]>([]);
  const [total, setTotal] = useState(0);

  // Fetch places when URL params change
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const result = await placesApi.search({
          q: currentQuery || undefined,
          type:
            currentType !== "all" ? (currentType as Place["type"]) : undefined,
        });

        if (result.success && result.data) {
          setPlaces(result.data);
          setTotal(result.pagination?.total || result.data.length);
        }
      } catch (error) {
        console.error("Failed to fetch places:", error);
        message.error("Failed to load places");
      }
    };

    fetchPlaces();
  }, [currentQuery, currentType]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    if (searchType !== "all") params.append("type", searchType);
    router.push(`/search?${params.toString()}`);
  };

  const getCardColor = (index: number) => {
    const colors = [
      { start: "#8b4513", end: "#a0522d" },
      { start: "#dcdcdc", end: "#f0f0f0" },
      { start: "#4169e1", end: "#6495ed" },
    ];
    return colors[index % 3];
  };

  return (
    <Layout className="min-h-screen">
      <Header />

      <Content>
        {/* Hero Search Section */}
        <div className="bg-gradient-to-br from-[#f5a623] to-[#f7b731] py-[60px] px-5 text-center">
          <h1 className="text-white text-[40px] font-bold mb-2">
            Хайлтын үр дүн
          </h1>
          <p className="text-white text-base mb-8">
            {searchQuery && `"${searchQuery}" хайлтын үр дүн: `}
            {total} бизнес
          </p>

          {/* Search Bar */}
          <div className="max-w-[700px] mx-auto bg-white rounded-lg p-2 flex gap-2 shadow-lg">
            <Input
              placeholder="Бизнес үйлчилгээн нэр хайх..."
              size="large"
              className="flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onPressEnter={handleSearch}
            />
            <Select
              value={searchType}
              size="large"
              className="w-[180px]"
              onChange={(value) => setSearchType(value)}
            >
              <Option value="all">Бүх ангилал</Option>
              <Option value="restaurant">Ресторан</Option>
              <Option value="hotel">Зочид буудал</Option>
              <Option value="shop">Дэлгүүр</Option>
              <Option value="service">Үйчилгээ</Option>
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

        {/* Search Results Grid */}
        <div className="py-[60px] px-[50px] bg-gray-100">
          <Row gutter={[24, 24]}>
            {places.map((listing, index) => (
              <Col xs={24} sm={12} lg={8} key={listing.id}>
                <Link
                  href={`/details/${listing.id}`}
                  className="no-underline text-inherit"
                >
                  <Card
                    hoverable
                    cover={
                      <div
                        className="h-[200px] flex items-center justify-center bg-cover bg-center"
                        style={{
                          background: listing.images?.[0]
                            ? `url(${listing.images[0]}) center/cover`
                            : `linear-gradient(135deg, ${
                                getCardColor(index).start
                              } 0%, ${getCardColor(index).end} 100%)`,
                        }}
                      >
                        {/* Placeholder for image */}
                      </div>
                    }
                    className="rounded-lg overflow-hidden shadow-sm"
                  >
                    <Card.Meta
                      title={
                        <span className="text-lg font-bold">
                          {listing.name}
                        </span>
                      }
                      description={
                        <div>
                          <p className="mb-3 text-gray-600 text-sm">
                            {listing.description}
                          </p>
                          <div className="flex flex-col gap-2">
                            <div className="text-[13px] text-gray-400 flex items-center gap-1.5">
                              <EnvironmentOutlined className="text-[#faad14]" />
                              {listing.address}
                            </div>
                            <div className="text-[13px] text-gray-400 flex items-center gap-1.5">
                              <PhoneOutlined className="text-[#faad14]" />
                              {listing.phone}
                            </div>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
    </Layout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
