// Rec In Studio — página oficial: link de download (Release "latest" no GitHub), Pix da compra e WhatsApp do comprovante.
(function () {
    const $ = (s) => document.querySelector(s);
    const cfg = window.CONFIG || {};
    if (/[?&]anim\b/.test(location.search)) document.documentElement.classList.add('forcar-anim');

    // ---------------------------------------------------------------- download
    // O link "latest/download" nunca muda: cada versão nova sobe o mesmo nome de arquivo.
    const base = `https://github.com/${cfg.repo}/releases/latest/download/`;
    const arquivos = { mac: cfg.arquivo, win: cfg.arquivoWindows || 'RecInStudio-Setup.exe' };
    // (o botão da barra de navegação não tem data-download: ele rola até a seção de download)
    document.querySelectorAll('[data-download]').forEach((a) => { a.href = base + (arquivos[a.dataset.download] || cfg.arquivo); });

    // ---------------------------------------------------------------- abas Mac / Windows em "Instalar"
    const abas = document.querySelectorAll('.so-aba');
    const mostrarSO = (so) => {
        abas.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.so === so)));
        document.querySelectorAll('.so-painel').forEach((p) => { p.hidden = p.dataset.so !== so; });
    };
    abas.forEach((b) => b.addEventListener('click', () => mostrarSO(b.dataset.so)));
    if (/Windows/i.test(navigator.userAgent)) mostrarSO('win');
    if ($('#linkCodigo')) $('#linkCodigo').href = `https://github.com/${cfg.repo}`;
    if ($('#versao') && cfg.versao) $('#versao').textContent = 'v' + cfg.versao;
    if ($('#versaoRodape') && cfg.versao) $('#versaoRodape').textContent = 'versão ' + cfg.versao;

    // ---------------------------------------------------------------- galeria "Por dentro": uma tela por módulo
    const abasGaleria = document.querySelectorAll('.galeria-aba:not(.acao-aba)');
    abasGaleria.forEach((b) => b.addEventListener('click', () => {
        abasGaleria.forEach((x) => x.setAttribute('aria-selected', String(x === b)));
        document.querySelectorAll('.galeria-tela').forEach((f) => { f.hidden = f.dataset.tela !== b.dataset.tela; });
    }));

    // ---------------------------------------------------------------- Em ação: um vídeo por módulo (vertical no celular)
    const videoAcao = $('#videoAcao');
    if (videoAcao) {
        const celular = window.matchMedia('(max-width: 640px)');
        let modulo = 'legendas', visivel = false;
        const carregar = () => {
            const f = celular.matches ? '9x16' : '16x9';
            videoAcao.poster = `assets/videos/${modulo}-${f}.jpg`;
            videoAcao.src = `assets/videos/${modulo}-${f}.mp4`;
            if (visivel) videoAcao.play().catch(() => {});
        };
        const abasAcao = document.querySelectorAll('.acao-aba');
        abasAcao.forEach((b) => b.addEventListener('click', () => {
            abasAcao.forEach((x) => x.setAttribute('aria-selected', String(x === b)));
            modulo = b.dataset.video; carregar();
        }));
        celular.addEventListener('change', carregar);
        new IntersectionObserver(([e]) => {
            visivel = e.isIntersecting;
            if (visivel) videoAcao.play().catch(() => {}); else videoAcao.pause();
        }, { threshold: 0.4 }).observe(videoAcao);
        carregar();
    }

    // ---------------------------------------------------------------- WhatsApp do comprovante
    if ($('#linkWhats') && cfg.whatsapp) {
        const texto = `Olá! Paguei o Pix de R$ ${cfg.preco || '97,00'} do Rec In Studio. Segue o comprovante. Meu nome completo: `;
        $('#linkWhats').href = `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(texto)}`;
    }

    // ---------------------------------------------------------------- etapas animadas quando aparecem
    const fluxo = $('.etapas');
    if (fluxo && 'IntersectionObserver' in window) {
        new IntersectionObserver((entradas, obs) => {
            entradas.forEach((e) => {
                if (e.isIntersecting) { fluxo.classList.add('rodando'); obs.disconnect(); }
            });
        }, { threshold: 0.4 }).observe(fluxo);
    } else if (fluxo) {
        fluxo.classList.add('rodando');
    }

    // ---------------------------------------------------------------- Pix
    async function copiar(texto) {
        try {
            await navigator.clipboard.writeText(texto);
            return true;
        } catch (e) {
            const t = document.createElement('textarea');
            t.value = texto;
            t.style.position = 'fixed';
            t.style.opacity = '0';
            document.body.appendChild(t);
            t.select();
            let ok = false;
            try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
            t.remove();
            return ok;
        }
    }
    const pix = window.PIX;
    if (pix && $('#copiarPix')) {
        const aviso = $('#pixAviso');
        const avisar = (ok, msg) => {
            aviso.textContent = ok ? msg : 'Não consegui copiar. Selecione e copie a chave manualmente.';
            aviso.classList.toggle('copiado', ok);
        };
        $('#copiarPix').addEventListener('click', async () => avisar(await copiar(pix.copiaECola),
            `Pix copia e cola copiado (R$ ${cfg.preco || '97,00'})! Cole no app do seu banco e depois mande o comprovante.`));
        $('#copiarChave').addEventListener('click', async () => avisar(await copiar(pix.chave.replace(/\D/g, '')),
            `Chave copiada! Pague R$ ${cfg.preco || '97,00'} e depois mande o comprovante.`));
    }
})();
