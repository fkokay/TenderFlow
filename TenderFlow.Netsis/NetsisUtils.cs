using System;
using System.Collections.Generic;
using System.Text;

namespace TenderFlow.Netsis
{
    public static class NetsisUtils
    {
        public static string Fix(string text)
        {
            if (string.IsNullOrEmpty(text))
                return text;

            return text
                .Replace("Ý", "İ")
                .Replace("ý", "ı")
                .Replace("Þ", "Ş")
                .Replace("þ", "ş")
                .Replace("Ð", "Ğ")
                .Replace("ð", "ğ");
        }

        public static T FixAllStrings<T>(T obj)
        {
            if (obj == null) return obj;

            var props = obj.GetType().GetProperties()
                           .Where(p => p.PropertyType == typeof(string));

            foreach (var p in props)
            {
                var val = p.GetValue(obj) as string;
                if (val != null)
                    p.SetValue(obj, Fix(val));
            }

            return obj;
        }
    }
}
