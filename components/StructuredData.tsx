interface StructuredDataProps {
      schemas: Array<Record<string, unknown> | unknown[]>;
      idPrefix: string;
}

export default function StructuredData({ schemas, idPrefix }: StructuredDataProps) {
      if (schemas.length === 0) {
            return null;
      }

      return (
            <>
                  {schemas.map((schema, index) => (
                        <script
                              key={`${idPrefix}-${index}`}
                              type="application/ld+json"
                              dangerouslySetInnerHTML={{
                                    __html: JSON.stringify(schema),
                              }}
                        />
                  ))}
            </>
      );
}
